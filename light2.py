import RPi.GPIO as GPIO
import time
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
GPIO.setup(10,GPIO.OUT)
#print "LED Blue: On"
GPIO.output(10,GPIO.HIGH)
