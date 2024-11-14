export const generateOtpTemplate = (userName: string, otp: string): string => {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
          }
          .header {
            background-color: #f09433;
            background-image: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
            padding: 20px;
            text-align: center;
            color: white;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            letter-spacing: 1px;
          }
          .content {
            padding: 30px;
            text-align: center;
          }
          .content h2 {
            font-size: 22px;
            color: #333;
          }
          .otp {
            display: inline-block;
            background-color: #f09433;
            background-image: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
            padding: 10px 20px;
            color: white;
            font-size: 20px;
            letter-spacing: 5px;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #777;
          }
          .footer a {
            color: #bc1888;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Instagram</h1>
          </div>
          <div class="content">
            <h2>Hello, ${userName}!</h2>
            <p>Use the OTP below to complete your verification process:</p>
            <div class="otp">${otp}</div>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>Need help? <a href="#">Visit our Help Center</a></p>
            <p>&copy; 2024 Instagram, Inc.</p>
          </div>
        </div>
      </body>
    </html>
    `;
  };
  