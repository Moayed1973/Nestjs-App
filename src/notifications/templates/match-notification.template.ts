export class MatchNotificationTemplate {
  static generate(
    projectCountry: string,
    projectServices: string[],
    vendorName: string,
    matchScore: number,
    servicesOverlap: number,
    vendorRating: number,
    vendorSla: number,
  ): string {
    return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #007bff; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; }
            .footer { background: #eee; padding: 10px; text-align: center; font-size: 12px; }
            .metric { background: white; padding: 10px; margin: 10px 0; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 New Project Match!</h1>
            </div>
            <div class="content">
              <h2>Project Details</h2>
              <div class="metric">
                <strong>Country:</strong> ${projectCountry}<br>
                <strong>Services Needed:</strong> ${projectServices.join(', ')}
              </div>
  
              <h2>Vendor Match</h2>
              <div class="metric">
                <strong>Vendor:</strong> ${vendorName}<br>
                <strong>Match Score:</strong> ${matchScore.toFixed(2)}/5<br>
                <strong>Services Overlap:</strong> ${servicesOverlap} out of ${projectServices.length}<br>
                <strong>Vendor Rating:</strong> ${vendorRating}/5<br>
                <strong>Response SLA:</strong> ${vendorSla} hours
              </div>
  
              <p>Please review this match and contact the vendor if appropriate.</p>
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
