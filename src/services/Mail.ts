import nodemailer from "nodemailer";
class Mail {
  async sendMail(email: string, token: string) {
    const transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "93a41e3706d658",
        pass: "28b5d66df7f1cb",
      },
    });

    await transport.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>',
      to: [email],
      subject: "Redefinição de senha ✔",
      text: "Hello world?",

      html: `
      <!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap"
      rel="stylesheet"
    />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>POKEMON SHOP</title>
  </head>
  <style>
    * {
      margin: 0;
      border: 0 none;
      padding: 0;
      box-sizing: border-box;
      scroll-behavior: smooth;
    }

    body {
      background-color: #fff;
      font-family: 'Roboto', sans-serif;
    }

    .main-content {
      max-width: 1200px;
      min-height: 100vh;
      margin: 0 auto;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
    }

    .title {
      font-size: 24px;
      font-weight: 700;
      color: #222222;
      margin-bottom: 24px;
    }

    .container-content {
      max-width: 580px;
      padding: 30px;
      border-radius: 4px;
      background-color: #fff;

      box-shadow: rgba(17, 17, 26, 0.1) 0px 8px 24px,
        rgba(17, 17, 26, 0.1) 0px 16px 56px, rgba(17, 17, 26, 0.1) 0px 24px 80px;
    }

    .container-content h2 {
      font-size: 20px;
      font-weight: 700;
      color: #222222;
      margin-bottom: 20px;
      text-align: center;
    }

    .container-content p {
      color: #2c2c2c;
      font-size: 14px;
      font-weight: 400;
      margin-bottom: 14px;
      text-align: left;
    }

    .linkRecovery {
      padding: 10px 20px;
      background: red;
      display: block;
      width: 200px;
      margin: 0 auto;
      color: #f0f0f0;
      border-radius: 4px;
      margin: 20px auto 20px auto;
      text-decoration: none;
      text-align: center;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .logo img {
      width: 100px;
      height: 100px;
      object-fit: cover;
    }

    @media (max-width: 440px) {
      .title {
        text-align: center;
        font-size: 20px;
      }
      .main-content {
        padding: 15px;
      }
      .container-content {
        width: 100%;
      }
    }

    .footer {
      max-width: 200px;
      margin: 10px auto 10px auto;
      text-align: center;
    }
    .footer p {
      color: #2b2b2be1;
      font-size: 14px;
      font-weight: 400;
    }

  
  </style>
  <body>
    <main class="main-content">
      <div class="logo">
        <img
          src="https://cdn.leroymerlin.com.br/products/adesivo_de_olho_magico_pokebola_pokemon_1567040591_e931_600x600.jpg"
          alt=""
        />
      </div>
      <h1 class="title">Redefina sua senha do Pokemon shop</h1>

      <div class="container-content">
        <h2>Pokemon shop Redefinição de senha</h2>
        <p>Ouvimos dizer que você perdeu sua senha do Pokemon shop.</p>
        <p>
          Desculpe por isso! Mas não se preocupe! Você pode usar o botão a
          seguir para redefinir sua senha
        </p>

        <a
          class="linkRecovery"
          href="http://localhost:3000/newPassword/${token}"
          >Redefinir sua senha</a
        >

        <p>
          Se você não usar este link dentro de 1 horas, ele expirará. Para obter
          um novo link de redefinição de senha, visite:
          <a style="color: red"  href="http://localhost:3000/forgotPassword"
            >http://localhost:3000/forgotPassword</a
          >
        </p>
        <p style="text-align: left; color: #3b3b3bec">
          Obrigado, <br />
          Equipe do Pokemon shop
        </p>
      </div>
    </main>
    <footer class="footer">
      <p>@ feito por rogerio, github: https://github.com/rogeriosouz</p>
    </footer>
  </body>
</html>


      `,
    });
  }
}

export default new Mail();
