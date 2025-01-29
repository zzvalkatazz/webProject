

   <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <form action="user_login.php" method="post" novalidate>
    <link rel="stylesheet" href="log_and_registration.css">

    <title>Вход - Coin Collector</title>
</head>
<body>
<div class="container">
     <header>
        <h1>Coin Collector </h1>
     </header>
  

    <?php include("user_login_logic.php");?>

  <section>
  <form action="user_login.php" method="post">
    <fieldset>
        <legend>Въведете данни за вход</legend>

        <label for="Username">Потребителско име:</label><br>
        <input type ="text" name="username" id="Username" required value="<?php echo htmlspecialchars($_POST['username'] ?? '');?>"><br>
        <?php if(!empty($errors['username'])):?>
            <span style="color:dark-red;"><?php echo $errors['username'];?></span><br>
        <?php endif;?>
      
        <label for="Password">Парола:</label><br>
        <input type ="password" name="password" id="Password" required value="<?php echo htmlspecialchars($_POST['password'] ?? '');?>"><br>
        <?php if(!empty($errors['password'])):?>
            <span style="color:dark-red;"><?php echo $errors['password'];?></span><br>
        <?php endif;?>

        <?php if(!empty($errors['login'])):?>
            <span style="color:dark-red;"><?php echo $errors['login'];?></span><br>
        <?php endif;?>

        <input type="submit" value="Влез">
    </fieldset>
    </form>

       <p>Нямате акаунт?<a href="user_registration.php"> Регистрирайте се тук </a></p>
       </div>
  </section>

  </body>
  </html>