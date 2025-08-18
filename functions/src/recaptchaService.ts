import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';

/**
 * Crie uma avaliação para analisar o risco de uma ação da interface.
 *
 * projectID: O ID do seu projeto do Google Cloud.
 * recaptchaSiteKey: A chave reCAPTCHA associada ao site/app
 * token: O token gerado obtido do cliente.
 * recaptchaAction: Nome da ação correspondente ao token.
 */
export async function createAssessment({
  projectID = "diesel-cat-469314-d2",
  recaptchaKey = "6LceEKkrAAAAACp1jvVZgOCrOGiOrPf4utogANw6",
  token = "action-token",
  recaptchaAction = "LOGIN",
}: {
  projectID?: string;
  recaptchaKey?: string;
  token: string;
  recaptchaAction?: string;
}) {
  try {
    // Crie o cliente reCAPTCHA.
    const client = new RecaptchaEnterpriseServiceClient();
    const projectPath = client.projectPath(projectID);

    // Crie a solicitação de avaliação.
    const request = {
      assessment: {
        event: {
          token: token,
          siteKey: recaptchaKey,
        },
      },
      parent: projectPath,
    };

    const [response] = await client.createAssessment(request);

    // Verifique se o token é válido.
    if (!response.tokenProperties?.valid) {
      console.log(`The CreateAssessment call failed because the token was: ${response.tokenProperties?.invalidReason}`);
      return null;
    }

    // Verifique se a ação esperada foi executada.
    if (response.tokenProperties.action === recaptchaAction) {
      // Consulte a pontuação de risco e os motivos.
      console.log(`The reCAPTCHA score is: ${response.riskAnalysis?.score}`);
      
      if (response.riskAnalysis?.reasons) {
        response.riskAnalysis.reasons.forEach((reason) => {
          console.log(reason);
        });
      }

      return {
        score: response.riskAnalysis?.score,
        valid: true,
        action: response.tokenProperties.action
      };
    } else {
      console.log("The action attribute in your reCAPTCHA tag does not match the action you are expecting to score");
      return null;
    }
  } catch (error) {
    console.error('Erro na verificação do reCAPTCHA:', error);
    throw error;
  }
}
