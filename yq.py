# coding=utf-8
import hashlib
import logging
import time
import requests

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

data = None


def get_data():
    global data
    url = "http://103.66.32.242:8005/zwfwMovePortal/interface/interfaceJson"

    timestamp = str(int(time.time()))
    print(timestamp)
    nonceHeader = "123456789abcdefg"
    signatureHeaderStr = timestamp + "23y0ufFl5YxIyGrI8hWRUZmKkvtSjLQA" + nonceHeader + timestamp
    signatureHeader = hashlib.sha256(signatureHeaderStr.encode(encoding="UTF-8")).hexdigest()

    payload = {
        "appId": "NcApplication",
        "paasHeader": "zdww",
        "timestampHeader": timestamp,
        "nonceHeader": nonceHeader,
        "signatureHeader": signatureHeader.upper(),
        "key": "3C502C97ABDA40D0A60FBEE50FAAD1DA"
    }

    signatureStr = timestamp + "fTN2pfuisxTavbTuYVSsNJHetwq5bJvCQkjjtiLM2dCratiA" + timestamp
    signature = hashlib.sha256(signatureStr.encode(encoding="UTF-8")).hexdigest()
    headers = {
        'x-wif-nonce': 'QkjjtiLM2dCratiA',
        'x-wif-paasid': 'smt-application',
        'x-wif-signature': signature.upper(),
        'x-wif-timestamp': timestamp,
    }

    response = requests.post(url, headers=headers, json=payload)

    # logging.info(' ====> %s', response.text)
    response_json = response.json()
    # print(json.dumps(response_json, sort_keys=True, indent=2, ensure_ascii=False))
    print(f"最后更新时间: {response_json['data']['end_update_time']}")
    print(f"\t高风险个数: {response_json['data']['hcount']}")
    for high in response_json['data']['highlist']:
        print(f"\t\t地区: {high['area_name']}")
        print(f"\t\t城市: {high['city']}")
        print(f"\t\t社区: {', '.join(high['communitys'])}")
        print(f"\t\t县: {high['county']}")
        print(f"\t\t省: {high['province']}")
        print(f"\n")
    print(f"\t中风险个数: {response_json['data']['mcount']}")
    for middle in response_json['data']['middlelist']:
        print(f"\t\t地区: {middle['area_name']}")
        print(f"\t\t城市: {middle['city']}")
        print(f"\t\t社区: {', '.join(middle['communitys'])}")
        print(f"\t\t县: {middle['county']}")
        print(f"\t\t省: {middle['province']}")
        print("\n")

#