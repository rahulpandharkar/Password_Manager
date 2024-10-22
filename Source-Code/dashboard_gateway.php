<?php session_start();
error_reporting(0);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <?php 
    error_reporting(0);
    if($_SESSION['validate'] == true || $_SESSION['validated']==true)
    {
        $_SESSION['validate_for_records'] = true;
        echo "<script>window.location.href = 'dashboard.php';</script>"; 
    }
    else if($_SESSION['validate'] == false || $_SESSION['validated']==false)
    {
        echo "<script>alert('You are not logged in, kindly login to proceed to proceed to the dashboard')
        window.location.href = 'login_form.html';</script>"; 
    }
    ?>
    
</body>
</html>