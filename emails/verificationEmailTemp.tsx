import React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Preview,
} from "@react-email/components";

interface VerificationEmailProps {
  otp: string;
  username?: string;
}

const VerificationEmail: React.FC<VerificationEmailProps> = ({
  username,
  otp,
}) => {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address with the code: {otp}</Preview>
      <Body
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f9f9f9",
          margin: "0",
          padding: "0",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            padding: "20px",
          }}
        >
          <Section
            style={{
              backgroundColor: "#ffffff",
              padding: "40px",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            {/* Header */}
            <Section
              style={{
                textAlign: "center",
                marginBottom: "30px",
              }}
            >
              <Heading
                as="h1"
                style={{
                  color: "#333333",
                  margin: "0",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              >
                Email Verification
              </Heading>
            </Section>

            {/* Greeting */}
            <Section
              style={{
                marginBottom: "25px",
              }}
            >
              <Text
                style={{
                  fontSize: "16px",
                  color: "#555555",
                  lineHeight: "1.5",
                  margin: "0",
                }}
              >
                {username ? `Hello ${username},` : "Hello,"}
              </Text>
              <Text
                style={{
                  fontSize: "16px",
                  color: "#555555",
                  lineHeight: "1.5",
                  margin: "10px 0 0 0",
                }}
              >
                Thank you for signing up! Please use the verification code below
                to complete your registration.
              </Text>
            </Section>

            {/* OTP Display */}
            <Section
              style={{
                textAlign: "center",
                margin: "30px 0",
                padding: "20px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                border: "2px solid #e9ecef",
              }}
            >
              <Text
                style={{
                  fontSize: "14px",
                  color: "#666666",
                  marginBottom: "10px",
                  fontWeight: "500",
                  margin: "0 0 10px 0",
                }}
              >
                Your verification code is:
              </Text>
              <Text
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#007bff",
                  letterSpacing: "8px",
                  fontFamily: "monospace",
                  margin: "0",
                  textAlign: "center",
                }}
              >
                {otp}
              </Text>
            </Section>

            {/* Instructions */}
            <Section
              style={{
                marginBottom: "25px",
              }}
            >
              <Text
                style={{
                  fontSize: "14px",
                  color: "#666666",
                  lineHeight: "1.5",
                  margin: "0 0 10px 0",
                  fontWeight: "bold",
                }}
              >
                Important:
              </Text>
              <Text
                style={{
                  fontSize: "14px",
                  color: "#666666",
                  lineHeight: "1.5",
                  margin: "0 0 5px 0",
                }}
              >
                • This code will expire in 10 minutes
              </Text>
              <Text
                style={{
                  fontSize: "14px",
                  color: "#666666",
                  lineHeight: "1.5",
                  margin: "0 0 5px 0",
                }}
              >
                • Do not share this code with anyone
              </Text>
              <Text
                style={{
                  fontSize: "14px",
                  color: "#666666",
                  lineHeight: "1.5",
                  margin: "0",
                }}
              >
                • If you did not request this code, please ignore this email
              </Text>
            </Section>

            <Hr
              style={{
                borderColor: "#e9ecef",
                margin: "30px 0 20px 0",
              }}
            />

            {/* Footer */}
            <Section
              style={{
                textAlign: "center",
              }}
            >
              <Text
                style={{
                  fontSize: "12px",
                  color: "#999999",
                  margin: "0 0 5px 0",
                }}
              >
                This is an automated email. Please do not reply to this message.
              </Text>
              <Text
                style={{
                  fontSize: "12px",
                  color: "#999999",
                  margin: "0",
                }}
              >
                If you have any questions, please contact our support team.
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default VerificationEmail;
