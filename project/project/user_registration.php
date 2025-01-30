
 <!DOCTYPE html>
    <html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <form action="user_registration.php" method="post" novalidate>
    <link rel="stylesheet" href="log_and_registration.css">
    <title>Вход- Coin Collector</title>
</head>
<body>
   <div class="container">
     <header>
        <h1>Coin Collector</h1>
     </header>

     <?php include("user_registration_logic.php");?>


     <section>
    
    <form action="user_registration.php" method="post">
       <fieldset>
       <legend> Въведете данни за регистрация</legend>
       
       <label for="Username"> Потребителско име:</label><br>
       <input type="text" name="username" id="Username" required><br>

       <label for="Email"> Имейл:</label><br>
       <input type="email" name="email" id="Email" required><br>

       <label for="Password"> Парола:</label><br>
       <input type="password" name="password" id="Password" required><br>

       <label for="ConfirmedPassword"> Потвърждение на парола:</label><br>
       <input type="password" name="confirmedPassword" id="ConfirmedPassword" required><br>

      <input type="submit" value ="Създай акаунт">
     </fieldset>
    </form>
  </section>
</div>
   </body>
   </html>

   