/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
import {onCall} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import { createAssessment } from './recaptchaService';

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Função para verificar o reCAPTCHA Enterprise
export const verifyRecaptcha = onCall(async (request) => {
  try {
    const { token, action = 'LOGIN' } = request.data;
    
    if (!token) {
      throw new Error('Token do reCAPTCHA é obrigatório');
    }

    logger.info('Verificando reCAPTCHA', { token: token.substring(0, 10) + '...', action });

    const result = await createAssessment({
      token,
      recaptchaAction: action
    });

    if (!result) {
      throw new Error('Falha na verificação do reCAPTCHA');
    }

    logger.info('reCAPTCHA verificado com sucesso', { score: result.score, action: result.action });

    return {
      success: true,
      score: result.score,
      valid: result.valid,
      action: result.action
    };

  } catch (error) {
    logger.error('Erro na verificação do reCAPTCHA:', error);
    throw new Error(`Erro na verificação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
});

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
