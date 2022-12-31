<?php
session_start(); 
error_reporting(0);
if($_SERVER['REQUEST_METHOD'] == 'POST')
{
$con = mysqli_connect("localhost", "root", "", "data");
$username = $_SESSION['username'];  
$domain_name = $_POST["domain_name"];
$query = "Select Auth_Username, Auth_Password from information where Domain_Name = '$domain_name' and username = '$username';";
$result = mysqli_query($con, $query);
$row = mysqli_fetch_assoc($result);
if($row)
{
    ?>
    <html> 
        <head> 
        
            <title>Record Found</title>
            <body> 
        
                <div class = "align">
                    <?php
echo "<h1>Username : ".$row['Auth_Username'];
echo "<br>";
echo "<h1>Password: " . $row['Auth_Password'];
?>
</div>
</body>
<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700" rel="stylesheet"><link rel="stylesheet" href="style.css">
</head> 
</html>
<?php
}
else
{
    echo "<script>alert('Domain Name does not exist')
    window.location.href = 'dashboard_gateway.php'; 
    </script>";
}
$con->close();
}
else
echo "<script>alert('Unauthenticated Access')</script>"; 
   
?>
