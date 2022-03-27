import shutil
import os
import numpy as np
import cv2
from tensorflow.keras.layers import Layer
import tensorflow as tf
from random import randrange

# create verification and input directories
POS_PATH = os.path.join('data', 'positive')
NEG_PATH = os.path.join('data', 'negative')
ANC_PATH = os.path.join('data', 'anchor')
VER_PATH = os.path.join('application_data', 'verification_img')
INPUT_PATH = os.path.join('application_data', 'input_img')

# copy verification img from positive img
if os.path.isdir(VER_PATH):
    shutil.rmtree(VER_PATH)
shutil.copytree(POS_PATH, VER_PATH, dirs_exist_ok = True)

if os.path.isdir(INPUT_PATH):
    shutil.rmtree(INPUT_PATH)
os.makedirs(INPUT_PATH)


def preprocess(file_path):
    # Read in image from file path
    byte_img = tf.io.read_file(file_path)
    # Load in the image
    img = tf.io.decode_jpeg(byte_img)

    # Preprocessing steps - resizing the image to be 100x100x3
    img = tf.image.resize(img, (100, 100))
    # Scale image to be between 0 and 1
    img = img / 255.0

    # Return image
    return img


def preprocess_twin(input_img, validation_img, label):
    return(preprocess(input_img), preprocess(validation_img), label)

class L1Dist(Layer):
    def __init__(self, **kwargs):
        super().__init__()

    # similarity calculation
    def __call__(self, input_embedding, validation_embedding):
        return tf.math.abs(input_embedding - validation_embedding)


def verify(model, detection_threshold, verification_threshold):
    # Build results array
    results = []
    input_img = preprocess(os.path.join(INPUT_PATH, 'input_image.jpg'))
    for image in os.listdir(VER_PATH):
        validation_img = preprocess(os.path.join(VER_PATH, image))
        # Make Predictions
        result = model.predict(list(np.expand_dims([input_img, validation_img], axis=1)))
        results.append(result)

    # Detection Threshold: Metric above which a prediction is considered positive
    detection = np.sum(np.array(results) > detection_threshold)

    # Verification Threshold: Proportion of positive predictions / total positive samples
    verification = detection / len(os.listdir(os.path.join(VER_PATH)))
    verified = verification > verification_threshold

    return results, verified


gpus = tf.config.experimental.list_physical_devices('GPU')
for gpu in gpus:
    tf.config.experimental.set_memory_growth(gpu, True)

# load model
siamese_model = tf.keras.models.load_model('siamesemodelv2.h5', custom_objects={'L1Dist':L1Dist, 'BinaryCrossentropy':tf.losses.BinaryCrossentropy})

cap = cv2.VideoCapture(0)
while cap.isOpened():
    ret, frame = cap.read()
    frame = frame[120:120 + 250, 200:200 + 250, :]

    cv2.imshow('Verification', frame)

    # Verification trigger
    if cv2.waitKey(100) & 0xFF == ord('v'):
        cv2.imwrite(os.path.join(INPUT_PATH, 'input_image.jpg'), frame)
        # Run verification
        results, verified = verify(siamese_model, 0.5, 0.5)
        print(verified)

    if cv2.waitKey(100) & 0xFF == ord('q'):
        break
cap.release()
cv2.destroyAllWindows()