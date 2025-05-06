import logging 
import os
from sys import stdout

logger = logging.getLogger("uvicorn")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
if os.getenv('AWS_EXECUTION_ENV'):
    logger.propagate = False
    log_formatter = logging.Formatter('[%(levelname)s] %(message)s')
else:
    log_formatter = logging.Formatter('%(asctime)s %(levelname)-8s %(message)s')

handler.setFormatter(log_formatter)
logger.addHandler(handler)