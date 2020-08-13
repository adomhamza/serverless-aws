import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import { JwtPayload } from '../../auth/JwtPayload';
import { verify } from 'jsonwebtoken'



const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJfc/xzZ3PCm9KMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi1sLTI3cmIzdC51cy5hdXRoMC5jb20wHhcNMjAwODAyMTYwMzQzWhcN
MzQwNDExMTYwMzQzWjAkMSIwIAYDVQQDExlkZXYtbC0yN3JiM3QudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4LpfJo4yZuITRoPO
56Ee3+Hc60THZyRvKL39W3VqYdzX32QdqXAttQG3Uvl4EGCQsSYXby7Mi4y6xWip
vbgnrelJbTTvuTcj6SmSVmTkYHUNAzR1reaVXb0SkaVb8BQnZBY3UF1dE5BczUcL
VRY8rLiWWYu3qiZCZVkiOPyclrK96xyyiVQ3njj0P3vo0cbZJsvvVNVC2aElY90u
Fgckd8FFAxz4mqY0W7yGEtUwX3BYmLVSZtVJUOV6Vx7P/my5NKEOi9TDhcfzzn+o
+bgsfCumKRmIN/5+q6QeXaY2k/aVeIVzN9kSAuTrdpSs2HpLX5VJ5RwGJvO//Llf
83eo3QIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTRAQEG9cKN
QlFGBpNR/khg0d4R2jAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AAieOcQTwKDrg6B4t6W1pQu++67eXOMiL1Sx4bh+0YATkmDKnMEM9iNSYC5tUTWp
mlUAgaNZUU+pYV+mn5unXgplFt0nw6RVL80Z3APQtU+TTuf/r/ax9cxbInipSZ1O
WvZs83qYCoOYbFzWiRHioaWBkRbzHn9eQhznKfU5XGVklm8ODz8d0hgOKaK7TndJ
N4lA+xEYaIJsqw6qdmTo8zzexUFUWmAWLDlnKwhUs4QbhiohG9IGrekq7qDeGlaD
qBDM3s0lrKTYkohiebg2mCkquklLaVGb+MfTXMFNou5tD2e9qLL7PW0R2HkBq3aV
pyj4plKdwQrylVOmgxy5sUA=
-----END CERTIFICATE-----`



export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = verifyToken(event.authorizationToken)
    console.log('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log('User authorized', e.message)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

function verifyToken(authHeader: string): JwtPayload {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}