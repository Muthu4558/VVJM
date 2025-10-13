<?php
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$autoload = __DIR__ . '/vendor/autoload.php';
if (!file_exists($autoload)) {
    echo json_encode(['status' => 'error', 'message' => 'PHPMailer not found. Please run composer install.']);
    exit;
}
require $autoload;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    exit;
}

$formType = $_POST['formType'] ?? 'contact';

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'ranjithram878@gmail.com';
    $mail->Password   = 'wyjr cvmw bbir jqcr';
    $mail->SMTPSecure = 'tls';
    $mail->Port       = 587;

    $mail->setFrom('ranjithram878@gmail.com', 'Website Forms');
    $mail->addAddress('ranjithram878@gmail.com');

    $mail->isHTML(true);

    $headerColor = ($formType === 'admission') ? '#FF9933' : '#004aad';
    
    $templateHeader = '
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
            .header { background-color: ' . $headerColor . '; padding: 20px; text-align: center; }
            .header img { max-width: 150px; }
            .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
            .content { padding: 30px; color: #333333; line-height: 1.6; }
            .content h2 { color: #333; margin-top: 0; }
            .data-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .data-table td { padding: 12px 0; border-bottom: 1px solid #eeeeee; }
            .data-table tr:last-child td { border-bottom: none; }
            .data-table .label { font-weight: bold; color: #555555; width: 40%; }
            .footer { background-color: #f4f7f6; padding: 20px; text-align: center; font-size: 12px; color: #888888; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <!-- Using a generic title in the header now -->
                <h1>New Website Submission</h1>
            </div>
            <div class="content">';

    $templateFooter = '
            </div>
            <div class="footer">
                This is an automated notification from your website.
            </div>
        </div>
    </body>
    </html>';


    if ($formType === 'admission') {
        $parentName        = htmlspecialchars(trim($_POST['parent_name'] ?? ''));
        $studentName       = htmlspecialchars(trim($_POST['student_name'] ?? ''));
        $mobile            = htmlspecialchars(trim($_POST['mobile'] ?? ''));
        $email             = htmlspecialchars(trim($_POST['email'] ?? ''));
        $dob               = htmlspecialchars(trim($_POST['dob'] ?? ''));
        $admissionStandard = htmlspecialchars(trim($_POST['admission_standard'] ?? ''));
        $currentClass      = htmlspecialchars(trim($_POST['current_class'] ?? 'Not Provided'));
        $currentSchool     = htmlspecialchars(trim($_POST['current_school'] ?? 'Not Provided'));

        if (empty($parentName) || empty($studentName) || empty($email) || empty($mobile)) {
            echo json_encode(['status' => 'error', 'message' => 'Please fill out all required fields.']);
            exit;
        }
        
        $mail->Subject = "New Admission Enquiry for: " . $studentName;
        $mail->Body = $templateHeader . '
                <h2>New Admission Enquiry</h2>
                <p>An admission enquiry has been submitted through the website. The details are below:</p>
                <table class="data-table">
                    <tr><td class="label">Parent\'s Name:</td><td>' . $parentName . '</td></tr>
                    <tr><td class="label">Student\'s Name:</td><td>' . $studentName . '</td></tr>
                    <tr><td class="label">Mobile Number:</td><td>' . $mobile . '</td></tr>
                    <tr><td class="label">Email Address:</td><td>' . $email . '</td></tr>
                    <tr><td class="label">Student\'s DOB:</td><td>' . $dob . '</td></tr>
                    <tr><td class="label">Seeking Admission For:</td><td>' . $admissionStandard . '</td></tr>
                    <tr><td class="label">Current Class:</td><td>' . $currentClass . '</td></tr>
                    <tr><td class="label">Current School:</td><td>' . $currentSchool . '</td></tr>
                </table>
        ' . $templateFooter;

    } elseif ($formType === 'candidate') {
        $fullName   = htmlspecialchars(trim($_POST['fullName'] ?? ''));
        $mail->Subject = "New Candidate Submission: " . $fullName;
        $mail->Body = '...';

    } elseif ($formType === 'talent') {
        $companyName = htmlspecialchars(trim($_POST['companyName'] ?? ''));
        $mail->Subject = "New Talent Request from " . $companyName;
        $mail->Body = '...';
    
    } elseif ($formType === 'contact') {
        $message = htmlspecialchars(trim($_POST['message'] ?? ''));
        $mail->Subject = 'New Message from Website Contact Form';
        $mail->Body = '...';
    
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Unknown form type specified.']);
        exit;
    }

    $mail->send();
    echo json_encode(['status' => 'success', 'message' => '✅Thank you! Your enquiry has been sent successfully.']);
    exit;

} catch (Exception $e) {
    error_log('Mailer Error: ' . $mail->ErrorInfo);
    echo json_encode(['status' => 'error', 'message' => 'Sorry, we could not send your message at this time. Please try again later.']);
    exit;
}
