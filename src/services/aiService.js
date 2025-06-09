// AI API サービス
class AIService {
  
  static generateDentalSeminarDraft(inquiryInfo) {
    const apiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error(COMMON_CONFIG.ERROR_MESSAGES.NO_API_KEY);
    }
    
    const prompt = `
歯科セミナーに関する以下の問い合わせに対して、指定されたテンプレート形式で返信メールを作成してください。

【問い合わせ情報】
医院名: ${inquiryInfo.clinicName}
院長名: ${inquiryInfo.doctorName}先生
セミナー名: ${inquiryInfo.seminarName}
質問内容: ${inquiryInfo.question}

【返信テンプレート】
${inquiryInfo.clinicName}
${inquiryInfo.doctorName}先生

GDX事務局 中村です。
お世話になります。

セミナーに参加していただき、ありがとうございました。
また、アンケートのご返答、ありがとうございます｡

先生から頂きました質問は以下です。

━━━━━━━━━━━━━━━━
[ここに質問内容を記載]
━━━━━━━━━━━━━━━━

以下、回答です。

━━━━━━━━━━━━━━━━
[ここに適切な回答を記載してください]
━━━━━━━━━━━━━━━━

何かご質問があれば、お気軽に聞いて下さい。
どうぞよろしくお願いします。

GDX事務局 中村
seminar@globaldentalx.com
03-4510-4792

【注意事項】
- 質問内容と回答部分のみを適切に記入してください
- 他の部分はテンプレートのまま使用してください
- 回答は質問に対して的確で実用的なアドバイスを含めてください
- 専門的すぎず、分かりやすい言葉で説明してください

返信メールの本文のみを出力してください（件名は不要）。
`;

    return this._callOpenAI(prompt, inquiryInfo.seminarName);
  }
  
  static _callOpenAI(prompt, seminarName) {
    const apiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
    
    const response = UrlFetchApp.fetch(COMMON_CONFIG.OPENAI.API_URL, {
      method: 'post',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        model: COMMON_CONFIG.OPENAI.MODEL,
        messages: [{
          role: 'user',
          content: prompt
        }],
        max_tokens: COMMON_CONFIG.OPENAI.MAX_TOKENS,
        temperature: COMMON_CONFIG.OPENAI.TEMPERATURE
      }),
      muteHttpExceptions: true
    });

    if (response.getResponseCode() !== 200) {
      throw new Error(`${COMMON_CONFIG.ERROR_MESSAGES.API_ERROR}: ${response.getContentText()}`);
    }

    const result = JSON.parse(response.getContentText());
    const replyBody = result.choices[0].message.content;
    
    return {
      subject: `Re: ${seminarName}についてのお問い合わせ`,
      body: replyBody
    };
  }
}