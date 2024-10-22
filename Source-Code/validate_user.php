<?php
session_start();
error_reporting(0);
$flag = false; 
if(isset($_POST['username']))
{
$flag = true; 
$con = mysqli_connect("localhost", "root", "", "data");

$username = $_POST['username'];
$password = $_POST['password'];
$query = "Select username, password from user where username = '$username';";

$result = mysqli_query($con, $query);

$row = mysqli_fetch_assoc($result);

if($username == $row['username'] && $password == $row['password'])
{
    $_SESSION['validate'] = true; 
    $_SESSION['username'] = $row['username'];
    echo "<script>
    window.location.href = 'dashboard_gateway.php';</script>";
}
else if($username != $row['username'] || $password != $row['password'])
{
    echo "<script>
    alert('Incorrect username or password')
    window.location.href = 'login_form.html';
    </script>";
}
}
else if ($flag == false)
{
    echo "<script>alert('You are logged out, kindly login again to continue')
    window.location.href = 'login_form.html';</script>";
}
$con->close();
?>