<?php 
session_start();
$validation_factor = false;
if(isset($_POST['email']))
{
    $validation_factor = true; 
//Establishing Connection to the Database
$server = "localhost"; 
$username = "root"; 
$password = ""; 
$db = "data";

$con = mysqli_connect("localhost", "root", "", "data");
//Interacting with the database
$fname = $_POST['fname'];
$lname = $_POST['lname'];
$username = $_POST['username'];
$email = $_POST['email'];
$password = $_POST['password'];


//Checking for username already existing in the database
$query = "Select Username from user where Username = '$username';";
$result = mysqli_query($con, $query);
$row = mysqli_fetch_assoc($result);
if($username == $row['Username'])
{
    echo "<script>alert('Sorry, your entered username already exists, please choose a new username')
    window.location.href = 'register_form.html';</script>";
}

//Continuing interacting with the database
$query = "INSERT INTO user(`First Name`, `Last Name`, `Username`, `E-Mail`, `Password`, `Time`) VALUES ('$fname', '$lname', '$username', '$email', '$password', current_timestamp());";
$result = mysqli_query($con, $query);

if($result)
{
    $_SESSION['validated'] = true;
    echo "<script>alert('You have been registered sucessfully')
    window.location.href = 'dashboard_gateway.php';</script>";
}
}
else if($validation_factor == false)
{
    echo "<script>alert('Kindly proceed to the registration page')
    window.location.href = 'register_form.html';</script>"; 
}
$con->close();
?>