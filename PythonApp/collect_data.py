import cv2
import os
import uuid

POS_PATH = os.path.join('data', 'positive')
NEG_PATH = os.path.join('data', 'negative')
ANC_PATH = os.path.join('data', 'anchor')
#
# os.makedirs(POS_PATH)
# os.makedirs(NEG_PATH)
# os.makedirs(ANC_PATH)

# choose the number according to your webcam
cap = cv2.VideoCapture(0)
# begin capture and store image
while cap.isOpened():
    ret, frame = cap.read()
    # variable to limit the img in anchor and positive directories
    anc_img = 0
    pos_img = 0
    # Cut down frame to 250x250px
    frame = frame[120:120 + 250, 200:200 + 250, :]

    # Collect anchors
    if cv2.waitKey(1) & 0XFF == ord('a'):
        # Create the unique file path
        anc_img = anc_img + 1
        if anc_img > 108:
            continue
        imgname = os.path.join(ANC_PATH, '{}.jpg'.format(uuid.uuid1()))
        # Write out anchor image
        cv2.imwrite(imgname, frame)

    # Collect positives
    if cv2.waitKey(1) & 0XFF == ord('p'):
        pos_img = pos_img + 1
        if pos_img > 108:
            continue
        # Create the unique file path
        imgname = os.path.join(POS_PATH, '{}.jpg'.format(uuid.uuid1()))
        # Write out positive image
        cv2.imwrite(imgname, frame)

    # Show image back to screen
    cv2.imshow('Image Collection', frame)

    # Breaking gracefully
    if cv2.waitKey(1) & 0XFF == ord('q'):
        break

# Release the webcam
cap.release()
# Close the image show frame
cv2.destroyAllWindows()

