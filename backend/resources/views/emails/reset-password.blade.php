<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Réinitialisation de mot de passe — CesiZen</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f4; color: #333333; }
        .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
        .header { background-color: #4CAF50; padding: 32px 40px; text-align: center; }
        .logo-img { width: 80px; height: 80px; object-fit: contain; margin-bottom: 12px; display: block; margin-left: auto; margin-right: auto; }
        .header h1 { color: #ffffff; font-size: 26px; font-weight: 700; letter-spacing: -0.5px; margin: 0; }
        .header p { color: rgba(255,255,255,0.85); font-size: 14px; margin-top: 4px; }
        .body { padding: 40px; }
        .greeting { font-size: 18px; font-weight: 600; color: #333333; margin-bottom: 16px; }
        .text { font-size: 15px; color: #555555; line-height: 1.7; margin-bottom: 16px; }
        .btn-wrapper { text-align: center; margin: 32px 0; }
        .btn { display: inline-block; background-color: #4CAF50; color: #ffffff !important; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-size: 16px; font-weight: 600; letter-spacing: 0.3px; }
        .btn:hover { background-color: #388E3C; }
        .divider { border: none; border-top: 1px solid #AAAAAA; margin: 32px 0; opacity: 0.3; }
        .url-block { background: #f8f8f8; border-left: 4px solid #FFEB38; border-radius: 4px; padding: 12px 16px; margin-top: 8px; word-break: break-all; }
        .url-block a { color: #4CAF50; font-size: 13px; text-decoration: none; }
        .warning { background: #fff8e1; border: 1px solid #FFEB38; border-radius: 8px; padding: 14px 18px; margin-top: 24px; }
        .warning p { font-size: 13px; color: #7a6a00; line-height: 1.6; }
        .warning strong { color: #5a4e00; }
        .footer { background: #f8f8f8; padding: 24px 40px; text-align: center; border-top: 1px solid #eeeeee; }
        .footer p { font-size: 12px; color: #AAAAAA; line-height: 1.6; }
        .footer a { color: #4CAF50; text-decoration: none; }
    </style>
</head>
<body>
    <div class="wrapper">

        <!-- En-tête avec logo -->
        <div class="header">
            <img
                src="{{ config('app.url') }}/cesizen-logo.png"
                alt="Logo CesiZen"
                class="logo-img"
                width="80"
                height="80"
            />
            <h1>CesiZen</h1>
            <p>Votre compagnon pour la gestion du stress et le bien-être mental</p>
        </div>

        <!-- Corps du message -->
        <div class="body">
            <p class="greeting">Bonjour {{ $name }},</p>

            <p class="text">
                Vous recevez cet email car un administrateur a demandé la réinitialisation
                de votre mot de passe sur la plateforme <strong>CesiZen</strong>.
            </p>

            <p class="text">
                Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe :
            </p>

            <div class="btn-wrapper">
                <a href="{{ $url }}" class="btn">
                    Réinitialiser mon mot de passe
                </a>
            </div>

            <hr class="divider" />

            <p class="text" style="font-size:13px; color:#888;">
                Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
            </p>
            <div class="url-block">
                <a href="{{ $url }}">{{ $url }}</a>
            </div>

            <!-- Avertissement expiration -->
            <div class="warning">
                <p>
                    ⚠️ <strong>Ce lien est valable {{ $expireIn }} minutes.</strong>
                    Après ce délai, vous devrez contacter votre administrateur pour obtenir un nouveau lien.
                </p>
            </div>

            <p class="text" style="margin-top: 24px;">
                Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.
                Votre mot de passe restera inchangé.
            </p>
        </div>

        <!-- Pied de page -->
        <div class="footer">
            <p>
                Cet email a été envoyé automatiquement par <strong>CesiZen</strong>.<br />
                Ne répondez pas à cet email.
            </p>
            <p style="margin-top: 8px;">
                &copy; {{ date('Y') }} CesiZen — Ministère de la Santé
            </p>
        </div>

    </div>
</body>
</html>
