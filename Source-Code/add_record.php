<?php
session_start(); 
if($_SERVER['REQUEST_METHOD']=='POST')
{
$username = $_SESSION['username']; //username of the particular user in the database table of password
echo $username; 
$flag = false; 
$con = mysqli_connect("localhost", "root", "", "data");

$auth_username = $_POST['auth_username'];
$auth_password = $_POST['auth_password'];
$domain = $_POST['domain'];

$query = "Insert into information(username, Auth_Username, Auth_Password, Domain_Name) values ('$username','$auth_username', '$auth_password','$domain');";

$result = mysqli_query($con, $query);

if($result)
{
    echo "<script>alert('Record Added Sucessfully')
    window.location.href = 'dashboard_gateway.php';</script>";
}
}
else
{
    echo "<script>alert('You are trying to access this page without any authentication, kindly proceed to the login page')
    window.location.href = 'login_form.html';";
}
$con->close();



?>