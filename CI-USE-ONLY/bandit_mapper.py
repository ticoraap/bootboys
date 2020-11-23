import json

with open("rawBandit.json", 'r')as inputfile:
    data = json.load(inputfile)['results']


messages = []
for error in data:
    vulnerability = {
      "id": error['test_name'],
      "category": "sast",
      "message": error['issue_text'],
      "severity": error['issue_severity'],
      "confidence": error['issue_confidence'],
      "scanner": {
        "id": "bandit",
        "name": "Bandit"
      },
      "location": {
        "file": error['filename'],
        "start_line": error['line_number'],
      },
      "identifiers": [
        {
          "type": error['test_id'],
          "name": error['test_name'],
          "value": error['test_id'],
          "url": error['more_info']
        }
      ]
    }
    messages.append(vulnerability)

output = {
    "version": "2.0",
    "vulnerabilities": messages
}

with open("gl-sast-report.json", 'w') as outfile:
    json.dump(output, outfile, indent=4)
