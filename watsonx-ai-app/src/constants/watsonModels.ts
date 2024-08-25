export const WATSON_MODELS = {
    GRANITE_13B_CHAT_V2: 'ibm/granite-13b-chat-v2',
    GRANITE_13B_INSTRUCT_V2: 'ibm/granite-13b-instruct-v2',
    GRANITE_20B_MULTILINGUAL: 'ibm/granite-20b-multilingual',
    GRANITE_3B_CODE_INSTRUCT: 'ibm/granite-3b-code-instruct',
    GRANITE_8B_CODE_INSTRUCT: 'ibm/granite-8b-code-instruct',
    GRANITE_20B_CODE_INSTRUCT: 'ibm/granite-20b-code-instruct',
    GRANITE_34B_CODE_INSTRUCT: 'ibm/granite-34b-code-instruct',
  } as const;
  
  export type WatsonModelId = keyof typeof WATSON_MODELS;