export const baseTemplate = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
        }
        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #f9f9f9;
            padding: 40px 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }
        .header {
            background: linear-gradient(135deg, #1f8e5c 0%, #15a866ff 100%);
            padding: 40px 20px;
            text-align: center;
            color: #ffffff;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: 1px;
        }
        .body {
            padding: 40px 30px;
            color: #444444;
            line-height: 1.6;
        }
        .footer {
            background-color: #f1f3f5;
            padding: 20px;
            text-align: center;
            font-size: 13px;
            color: #777777;
        }
        .button {
            display: inline-block;
            padding: 14px 30px;
            background-color: #1f8e5c;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
        }
        .otp-code {
            font-size: 36px;
            font-weight: 800;
            color: #1f8e5c;
            letter-spacing: 8px;
            background-color: #f0f7ff;
            padding: 20px;
            border-radius: 8px;
            display: inline-block;
            margin: 25px 0;
            border: 1px solid #cce3ff;
        }
        .highlight {
            color: #1f8e5c;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <h1>DIGITAL KOHAT</h1>
            </div>
            <div class="body">
                ${content}
            </div>
            <div class="footer">
                <p>&copy; 2026 Digital Kohat - KP IT Board Initiative</p>
                <p>Digitalizing your city for a better tomorrow.</p>
            </div>
        </div>
    </div>
</body>
</html>
`;
