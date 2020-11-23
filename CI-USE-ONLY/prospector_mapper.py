import json

with open("../prospectoroutput.json", 'r')as inputfile:
    data = json.load(inputfile)['messages']

messages = []
for error in data:
    message = {
        "description": error['message'],
        "fingerprint": error['code'],
        "location": {
            "path": error['location']['path'],
            "lines": {
                "begin": error['location']['line']
            }
        }
    }
    messages.append(message)

with open("prospector_result.json", 'w') as outfile:
    json.dump(messages, outfile, indent=4)