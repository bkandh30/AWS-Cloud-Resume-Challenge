# AWS Cloud Resume Challenge

This repository contains the code and documentation for my attempt at the [AWS Cloud Resume Challenge](https://cloudresumechallenge.dev/docs/the-challenge/aws/). This challenge involves building a personal resume website hosted on AWS, incorporating various cloud services and DevOps practices.

## About The Challenge

The Cloud Resume Challenge is a hands-on project designed to help individuals learn and demonstrate cloud and DevOps skills. The AWS version focuses on utilizing Amazon Web Services to build, deploy, and manage a serverless web application.

## Architecture Diagram

![Architecture Diagram](architecture.png)

## Challenge Steps & Implementation

### **Amazon S3 (Simple Storage Service)**

- **Purpose**: Securely hosts the static website content, including HTML, CSS, and JavaScript files for the resume.
- **Configuration Highlights**:
  - A new S3 bucket was provisioned to store the frontend assets (`index.html`, `style.css`, etc.).
  - **Crucially, static website hosting directly on the S3 bucket was intentionally disabled.** Access to the website content is exclusively managed via Amazon CloudFront to enhance security, leverage caching, and enforce HTTPS.

### **Amazon CloudFront**

- **Purpose**: Serves as the Content Delivery Network (CDN) to distribute the website globally. This improves load times for users, enhances security (e.g., by handling SSL/TLS termination), and reduces latency.
- **Configuration Highlights**:
  - **Origin**: The S3 bucket (created above) was configured as the origin domain.
  - **Origin Access**: Implemented **Origin Access Control (OAC)**. This is the recommended AWS best practice for securely serving private S3 content through CloudFront, ensuring that the S3 bucket is not publicly accessible.
  - **Viewer Protocol Policy**: Set to **Redirect HTTP to HTTPS**. This ensures that all user traffic is encrypted and secure.
  - **AWS WAF (Web Application Firewall)**: WAF was **not enabled** for this iteration of the project.
  - **Default Root Object**: Configured to `index.html`. This ensures that users accessing the root URL of the distribution (or custom domain) are served the main resume page.
  - Other settings were maintained at their default values unless specified.
- **S3 Bucket Policy Update**: Post-CloudFront distribution creation, the S3 bucket policy was updated with the policy statement provided by CloudFront. This grants the CloudFront distribution the necessary permissions to fetch objects from the S3 bucket.

### **AWS Certificate Manager (ACM)**

- **Purpose**: Provisions, manages, and deploys public SSL/TLS certificates to enable HTTPS for the custom domain name.
- **Action**:
  - A public SSL/TLS certificate was requested through ACM for the custom domain associated with the resume website.
  - The certificate was validated (typically via DNS or email validation).
  - **Note**: The DNS validation process can take approximately 30 minutes for the pending status to resolve and the certificate to become active.

### **Amazon Route 53**

- **Purpose**: Provides a highly available and scalable Domain Name System (DNS) web service. It translates human-readable domain names (e.g., `www.your-resume.com`) into the IP addresses that computers use to connect to each other.
- **Configuration Highlights**:
  - An **Alias record** was created within the appropriate hosted zone for the custom domain.
  - This Alias record points the custom domain name (e.g., `resume.yourdomain.com` or `www.yourdomain.com`) to the Amazon CloudFront distribution domain name. Using an Alias record is an AWS best practice for routing traffic to AWS resources like CloudFront.

---

## Deployment & Accessing the Live Resume

Once the CloudFront distribution was successfully deployed and the DNS records in Route 53 had propagated:

1.  The **CloudFront Distribution Domain Name** (e.g., `d12345abcdef.cloudfront.net`) was initially tested in a web browser to confirm that the website content was being served correctly via CloudFront.
2.  Subsequently, after allowing time for DNS propagation, the **custom domain name** (configured in Route 53) was accessed in a browser to verify that it correctly resolved to and displayed the resume website served through CloudFront.
