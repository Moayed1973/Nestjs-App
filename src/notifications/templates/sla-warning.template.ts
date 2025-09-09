export class SlaWarningTemplate {
  static generate(
    vendorName: string,
    promisedSla: number,
    expiredMatches: number,
    countries: string[],
    services: string[],
  ): string {
    return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ff6b6b; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; }
            .footer { background: #eee; padding: 10px; text-align: center; font-size: 12px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ SLA Warning</h1>
            </div>
            <div class="content">
              <div class="warning">
                <h2>Vendor: ${vendorName}</h2>
                <p><strong>Promised SLA:</strong> ${promisedSla} hours response time</p>
                <p><strong>Expired Matches:</strong> ${expiredMatches} matches have exceeded the response time</p>
              </div>
  
              <h3>Vendor Details</h3>
              <p><strong>Countries Supported:</strong> ${countries.join(', ')}</p>
              <p><strong>Services Offered:</strong> ${services.join(', ')}</p>
  
              <p>Please follow up with the vendor regarding their response time compliance.</p>
            </div>
            <div class="footer">
              <p>This is an automated message from Expanders360 Global Expansion System</p>
            </div>
          </div>
        </body>
        </html>
      `;
  }
}
