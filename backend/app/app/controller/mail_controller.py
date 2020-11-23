from flask_mail import Message
from extensions import mail

app_context_mail = None


def send_mail(mail_recipient, title, body):
    """
    Sending a custom mail to people

    :arg:
        mail_recipient: For the recipient you can enter a single mail address or multiple addresses in an array
        title: title of the mail
        body: HTML containing the message of the email

    :returns:
        None
    """
    message = make_message(mail_recipient, title, body)
    mail.send(message)


def add_title(title):
    return Message(title)


def check_if_multiple_recipients(mail_recipient):
    return isinstance(mail_recipient, list)


def add_recipients(message, mail_recipients):
    for recipient in mail_recipients:
        message.add_recipient(recipient)
    return message


def add_recipient(message, mail_recipient):
    multiple_recipients = check_if_multiple_recipients(mail_recipient)

    if multiple_recipients:
        add_recipients(message, mail_recipient)
    else:
        message.add_recipient(mail_recipient)
    return message


def add_sender(message):
    message.sender = 'Bootboys <isensemarina@gmail.com>'
    return message


def add_reply_to(message):
    message.reply_to = 'Bootboys <isensemarina@gmail.com>'
    return message


def add_body(message, body):
    message.html = body
    return message


def make_message(mail_recipient, title, body):
    message = add_title(title)
    message = add_recipient(message, mail_recipient)
    message = add_sender(message)
    message = add_reply_to(message)
    message = add_body(message, body)
    return message
