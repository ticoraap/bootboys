from flask import Blueprint, request, Response
from flask import jsonify
from controller.mail_controller import send_mail
from controller.shared_controller import get_field_from_json, get_json_from_request, get_uuid4_as_string, \
    hash_to_sha256_str, get_database_session
from dao import user_dao
from models.user import User
from controller.user_controller import create_user_for_frontend

login_api = Blueprint('loginApi', __name__)
password_readable_form = 0
password_hash_form = 1


@login_api.route('/trylogin', methods=['POST'])
def try_login():
    credentials = request.get_json()
    attempting_user = user_dao.get_user_by_username(get_field_from_json(credentials, 'username'))
    if isinstance(attempting_user, User) and \
            attempting_user.is_password_equal(get_field_from_json(credentials, 'password')):

        return jsonify(user=create_user_for_frontend(attempting_user)), 200
    return Response(status=401)


@login_api.route('/requestnewpass', methods=['POST'])
def set_and_mail_temporary_password_to_user():
    attempting_user = get_user_from_mail_address(request)

    if attempting_user is not None:
        passwords = generate_new_password_and_hash_from_new_password()
        update_user_password(attempting_user, passwords[password_hash_form])
        make_and_send_password_mail(passwords[password_readable_form], attempting_user)
    return jsonify(status=200)


def make_and_send_password_mail(password, attempting_user):
    message = get_password_reset_message(password, attempting_user.username)
    send_mail([attempting_user.mail], 'Password reset', message)


def generate_new_password_and_hash_from_new_password():
    new_password = get_uuid4_as_string()
    new_password_hashed = hash_to_sha256_str(new_password)
    return [new_password, new_password_hashed]


def get_user_from_mail_address(request_body):
    mail_address_json = get_json_from_request(request_body)
    mail_address = get_field_from_json(mail_address_json, 'email')
    attempting_user = user_dao.get_user_by_email(email=mail_address)
    return attempting_user


def set_new_password(attempting_user, new_password_hashed):
    attempting_user.password = new_password_hashed
    return attempting_user


def generate_hashed_password_from_uuid():
    new_password = get_uuid4_as_string()
    new_password_hashed = hash_to_sha256_str(new_password)
    return new_password_hashed


def update_user_password(attempting_user, new_password_hashed):
    attempting_user = set_new_password(attempting_user, new_password_hashed)
    session = get_database_session()
    session.commit()


def get_password_reset_message(new_password, username):
    return '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" ' \
           '"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> <html style="width:100%;font-family:arial, ' \
           'helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;"> ' \
           '<head>  <meta charset="UTF-8">  <meta content="width=device-width, initial-scale=1" name="viewport">' \
           '<meta name="x-apple-disable-message-reformatting"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> ' \
           '<meta content="telephone=no" name="format-detection"> <title>Password Reset</title><style ' \
           'type="text/css">@media only screen and (max-width:600px) {p, ul li, ol li, a { font-size:16px!important; ' \
           'line-height:150%!important } h1 { font-size:30px!important; text-align:center; line-height:120%!important '\
           '} h2 { font-size:26px!important; text-align:center; line-height:120%!important } h3 { ' \
           'font-size:20px!important; text-align:center; line-height:120%!important } h1 a { font-size:30px!important '\
           '} h2 a { font-size:26px!important } h3 a { font-size:20px!important } .es-menu td a { ' \
           'font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, ' \
           '.es-header-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ' \
           'ol li, .es-footer-body a { font-size:16px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock '\
           'ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } ' \
           '.es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, ' \
           '.es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1,'\
           '.es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l'\
           'img { display:inline!important } .es-button-border { display:block!important } a.es-button { ' \
           'font-size:20px!important; display:block!important; border-width:10px 0px 10px 0px!important } .es-btn-fw {'\
           'border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, ' \
           '.es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, ' \
           '.es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } '\
           '.es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; ' \
           'height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } ' \
           '.es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { ' \
           'padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { '\
           'display:none!important } .es-desk-hidden { display:table-row!important; width:auto!important; ' \
           'overflow:visible!important; float:none!important; max-height:inherit!important; ' \
           'line-height:inherit!important } .es-desk-menu-hidden { display:table-cell!important } ' \
           'table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { ' \
           'display:inline-block!important } table.es-social td { display:inline-block!important } }#outlook a {' \
           'padding:0;}.ExternalClass {width:100%;}.ExternalClass,.ExternalClass p,.ExternalClass span,' \
           '.ExternalClass font,.ExternalClass td,.ExternalClass div {line-height:100%;}.es-button {' \
           'mso-style-priority:100!important;text-decoration:none!important;}a[x-apple-data-detectors] {' \
           'color:inherit!important;text-decoration:none!important;font-size:inherit!important;' \
           'font-family:inherit!important;font-weight:inherit!important;line-height:inherit!important;}' \
           '.es-desk-hidden {display:none;float:left;overflow:hidden;width:0;max-height:0;line-height:0;' \
           'mso-hide:all;}</style> </head> <body style="width:100%;font-family:arial, helvetica, ' \
           'sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;"><div ' \
           'class="es-wrapper-color" style="background-color:#F6F6F6;"><table class="es-wrapper" width="100%" ' \
           'cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse' \
           ';border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position'\
           ':center top;"> <tr style="border-collapse:collapse;"> <td valign="top" style="padding:0;Margin:0;"> ' \
           '<table class="es-content" cellspacing="0" cellpadding="0" align="center" ' \
           'style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout' \
           ':fixed !important;width:100%;"> <tr style="border-collapse:collapse;"> <td align="center" ' \
           'style="padding:0;Margin:0;"> <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" ' \
           'bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse'\
           ';border-spacing:0px;background-color:#FFFFFF;"> <tr style="border-collapse:collapse;"> <td ' \
           'align="left" style="Margin:0;padding-bottom:5px;padding-top:20px;padding-left:20px;padding-right:20px;">' \
           '<table class="es-left" cellspacing="0" cellpadding="0" align="left" ' \
           'style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;">'\
           '<tr style="border-collapse:collapse;"> <td class="es-m-p0r es-m-p20b" width="174" align="center" ' \
           'style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" role="presentation" ' \
           'style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"><tr ' \
           'style="border-collapse:collapse;"><td align="center" ' \
           'style="padding:0;Margin:0;padding-bottom:10px;padding-top:15px;"><table width="100%" height="100%" ' \
           'cellspacing="0" cellpadding="0" border="0" role="presentation" ' \
           'style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"><tr ' \
           'style="border-collapse:collapse;"><td style="padding:0;Margin:0px;border-bottom:1px solid ' \
           '#CCCCCC;height:1px;width:100%;margin:0px;"></td></tr></table></td></tr></table></td><td ' \
           'class="es-hidden" width="20" style="padding:0;Margin:0;"></td></tr> </table><table class="es-left" ' \
           'cellspacing="0" cellpadding="0" align="left" ' \
           'style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;">'\
           '<tr style="border-collapse:collapse;"> <td class="es-m-p20b" width="173" align="center" ' \
           'style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" role="presentation" ' \
           'style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr ' \
           'style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;"><h2 ' \
           'style="Margin:0;line-height:29px;mso-line-height-rule:exactly;font-family:arial, helvetica, ' \
           'sans-serif;font-size:24px;font-style:normal;font-weight:normal;color:#333333;">BootBnB</h2></td> </tr> ' \
           '</table></td> </tr> </table><table class="es-right" cellspacing="0" cellpadding="0" align="right" ' \
           'style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right' \
           ';"> <tr style="border-collapse:collapse;"> <td width="173" align="center" style="padding:0;Margin:0;"> ' \
           '<table width="100%" cellspacing="0" cellpadding="0" role="presentation" ' \
           'style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr ' \
           'style="border-collapse:collapse;"> <td align="center" ' \
           'style="padding:0;Margin:0;padding-bottom:10px;padding-top:15px;"> <table width="100%" height="100%" ' \
           'cellspacing="0" cellpadding="0" border="0" role="presentation" ' \
           'style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr ' \
           'style="border-collapse:collapse;"> <td style="padding:0;Margin:0px;border-bottom:1px solid ' \
           '#CCCCCC;height:1px;width:100%;margin:0px;"></td> </tr> </table></td> </tr> </table></td> </tr> ' \
           '</table></td></tr> <tr style="border-collapse:collapse;"> <td align="left" ' \
           'style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"><table cellpadding="0" ' \
           'cellspacing="0" class="es-left" align="left" ' \
           'style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;">'\
           '<tr style="border-collapse:collapse;"> <td width="180" class="es-m-p0r es-m-p20b" valign="top" ' \
           'align="center" style="padding:0;Margin:0;"> <table cellpadding="0" cellspacing="0" width="100%" ' \
           'role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border' \
           '-spacing:0px;"> <tr style="border-collapse:collapse;"> <td align="center" ' \
           'style="padding:0;Margin:0;font-size:0px;"><img class="adapt-img" ' \
           'src="http://bootboys.nl/static/media/boatLogo.8ff7ee0c.png" alt ' \
           'style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" ' \
           'width="180"></td></tr> </table></td> </tr> </table><table cellpadding="0" cellspacing="0" ' \
           'align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px'\
           ';"> <tr style="border-collapse:collapse;"> <td width="360" align="left" style="padding:0;Margin:0;"> ' \
           '<table cellpadding="0" cellspacing="0" width="100%" role="presentation" ' \
           'style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr ' \
           'style="border-collapse:collapse;"> <td align="left" class="es-m-txt-c" style="padding:0;Margin:0;"><h1 ' \
           'style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:arial, helvetica, ' \
           'sans-serif;font-size:30px;font-style:normal;font-weight:normal;color:#333333;"><strong>New ' \
           'Password</strong></h1></td></tr> </table></td> </tr> </table></td></tr> <tr ' \
           'style="border-collapse:collapse;"> <td align="left" ' \
           'style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> <table width="100%" ' \
           'cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse' \
           ';border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td width="560" valign="top" ' \
           'align="center" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" ' \
           'role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border' \
           '-spacing:0px;"> <tr style="border-collapse:collapse;"> <td align="center" ' \
           'style="padding:0;Margin:0;"><h3 style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family' \
           ':arial helvetica, sans-serif;font-size:20px;font-style:normal;font-weight:normal;color:#333333;">Dear ' + \
           username + ',<br>Your new '\
           'password is: <br>' + new_password + '<br><br>Please change it as soon as possible.<br>If you didnt request'\
                                                " this new password don't worry no one has come into your account," \
                                                "just "\
                                                'change your password again.</h3></td></tr> ' \
                                                '</table></td> </tr> </table></td> </tr> <tr ' \
                                                'style="border-collapse:collapse;"> <td align="left" ' \
                                                'style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding' \
                                                '-right:20px;"> <table cellpadding="0" cellspacing="0" width="100%" ' \
                                                'style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse' \
                                                ':collapse;border-spacing:0px;"> <tr ' \
                                                'style="border-collapse:collapse;"> <td width="560" align="center" ' \
                                                'valign="top" style="padding:0;Margin:0;"> <table cellpadding="0" ' \
                                                'cellspacing="0" width="100%" role="presentation" ' \
                                                'style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse' \
                                                ':collapse;border-spacing:0px;"> <tr ' \
                                                'style="border-collapse:collapse;"> <td align="center" ' \
                                                'style="padding:10px;Margin:0;"><span class="es-button-border" ' \
                                                'style="border-style:solid;border-color:#2E52BB;background:#3566D0' \
                                                ';border-width:0px;display:inline-block;border-radius:30px;width:auto' \
                                                ';"><a href="http://bootboys.nl/" class="es-button" target="_blank" ' \
                                                'style="mso-style-priority:100 ' \
                                                '!important;text-decoration:none;-webkit-text-size-adjust:none;-ms' \
                                                '-text-size-adjust:none;mso-line-height-rule:exactly;font-family' \
                                                ':arial, helvetica, ' \
                                                'sans-serif;font-size:18px;color:#FFFFFF;border-style:solid;border' \
                                                '-color:#3566D0;border-width:10px 20px 10px ' \
                                                '20px;display:inline-block;background:#3566D0;border-radius:30px;font' \
                                                '-weight:normal;font-style:normal;line-height:22px;width:auto;text' \
                                                '-align:center;">Login</a></span></td> </tr>  </table></td>  </tr> ' \
                                                ' </table></td>  </tr>  </table></td>  </tr>  </table></td>  ' \
                                                '</tr>  </table>  </div>  </body> </html>'
