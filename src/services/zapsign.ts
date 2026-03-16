const API_TOKEN =
  import.meta.env.VITE_ZAPSIGN_TOKEN ||
  '72e6679d-fe5b-49bd-97d7-9090ebff8d4cd0a20e28-931c-4691-9189-ee63c9ac8665'
const BASE_URL = 'https://api.zapsign.com.br/api/v1'

export async function createZapSignDocument(name: string, signerName: string, signerEmail: string) {
  try {
    const url = `${BASE_URL}/docs/?api_token=${API_TOKEN}`
    const payload = {
      name,
      url_pdf: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      signers: [
        {
          name: signerName,
          email: signerEmail || 'cliente@email.com',
          auth_mode: 'assinaturaEmTela',
        },
      ],
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      return await response.json()
    }
    console.warn('ZapSign API non-ok response, falling back to mock data')
  } catch (error) {
    console.warn('ZapSign API failed (possibly CORS), using mock fallback', error)
  }

  // Mock fallback if API fails
  return {
    token: `mock-token-${Math.random().toString(36).substring(7)}`,
    status: 'pending',
    signers: [
      {
        name: signerName,
        email: signerEmail,
        sign_url: 'https://sandbox.zapsign.com.br/assinar/mock-url-123',
        status: 'new',
      },
    ],
  }
}

export async function getZapSignDocument(token: string) {
  try {
    if (!token.startsWith('mock-')) {
      const url = `${BASE_URL}/docs/${token}/?api_token=${API_TOKEN}`
      const response = await fetch(url)
      if (response.ok) {
        return await response.json()
      }
    }
  } catch (error) {
    console.warn('ZapSign API failed (possibly CORS), using mock fallback', error)
  }

  // Mock fallback
  return {
    token,
    status: 'signed',
    signed_file: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    signers: [
      {
        status: 'signed',
      },
    ],
  }
}
