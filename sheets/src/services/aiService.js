/**
 * AI APIサービス
 * 統合版 - 各シートタイプに対応したプロンプト生成
 */
class AIService {
  
  /**
   * セミナー回答を生成
   * @param {Object} data - 抽出されたデータ
   * @param {string} sheetType - シートタイプ
   * @returns {string} AI生成回答
   */
  static async generateSeminarResponse(data, sheetType) {
    const apiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error(COMMON_CONFIG.ERROR_MESSAGES.NO_API_KEY);
    }
    
    const prompt = this.generatePrompt(data, sheetType);
    
    try {
      const response = UrlFetchApp.fetch(COMMON_CONFIG.OPENAI.API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        payload: JSON.stringify({
          model: COMMON_CONFIG.OPENAI.MODEL,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: COMMON_CONFIG.OPENAI.MAX_TOKENS,
          temperature: COMMON_CONFIG.OPENAI.TEMPERATURE
        })
      });
      
      const responseData = JSON.parse(response.getContentText());
      
      if (responseData.error) {
        throw new Error(`${COMMON_CONFIG.ERROR_MESSAGES.API_ERROR}: ${responseData.error.message}`);
      }
      
      const aiResponse = responseData.choices[0].message.content.trim();
      console.log(`AI回答生成成功 (${sheetType})`, aiResponse.substring(0, 100) + '...');
      
      return aiResponse;
      
    } catch (error) {
      console.error(`AI API エラー (${sheetType}):`, error);
      throw error;
    }
  }
  
  /**
   * シートタイプ別のプロンプトを生成
   * @param {Object} data - 抽出されたデータ
   * @param {string} sheetType - シートタイプ
   * @returns {string} プロンプト
   */
  static generatePrompt(data, sheetType) {
    const baseTemplate = this.getBaseTemplate();
    
    switch (sheetType) {
      case 'WEEKEND':
        return this.generateWeekendPrompt(data, baseTemplate);
      case 'OTHER':
        return this.generateOtherPrompt(data, baseTemplate);
      case 'INQUIRY':
        return this.generateInquiryPrompt(data, baseTemplate);
      default:
        throw new Error(`Unknown sheet type: ${sheetType}`);
    }
  }
  
  /**
   * WeekendDent用プロンプト生成
   */
  static generateWeekendPrompt(data, baseTemplate) {
    return `
WeekendDentセミナーに関する以下の問い合わせに対して、指定されたテンプレート形式で返信メールを作成してください。

【問い合わせ情報】
先生名: ${data.doctorName}先生
セミナータイプ: ${data.seminarType}
セミナー感想: ${data.impression}
質問内容: ${data.question}

${baseTemplate}

【注意事項】
- WeekendDentセミナーの内容に関する質問として回答してください
- セミナー感想も参考にして、適切な回答を生成してください
- 質問内容と回答部分のみを適切に記入してください
- 他の部分はテンプレートのまま使用してください
`;
  }
  
  /**
   * その他セミナー用プロンプト生成
   */
  static generateOtherPrompt(data, baseTemplate) {
    return `
その他セミナーに関する以下の問い合わせに対して、指定されたテンプレート形式で返信メールを作成してください。

【問い合わせ情報】
医院名: ${data.clinicName}
先生名: ${data.doctorName}先生
概要: ${data.summary}
質問内容: ${data.question}

${baseTemplate}

【注意事項】
- その他セミナーの内容に関する質問として回答してください
- 概要も参考にして、適切な回答を生成してください
- 質問内容と回答部分のみを適切に記入してください
- 他の部分はテンプレートのまま使用してください
`;
  }
  
  /**
   * お問い合わせ用プロンプト生成
   */
  static generateInquiryPrompt(data, baseTemplate) {
    return `
一般的なお問い合わせに対して、指定されたテンプレート形式で返信メールを作成してください。

【問い合わせ情報】
医院名: ${data.clinicName}
先生名: ${data.doctorName}先生
職位: ${data.position}
概要: ${data.summary}
質問内容: ${data.question}

${baseTemplate}

【注意事項】
- 一般的なお問い合わせとして適切に回答してください
- 概要も参考にして、具体的で有用な回答を生成してください
- 質問内容と回答部分のみを適切に記入してください
- 他の部分はテンプレートのまま使用してください
`;
  }
  
  /**
   * 基本テンプレートを取得
   * @returns {string} 基本テンプレート
   */
  static getBaseTemplate() {
    return `
【返信テンプレート】
[医院名]
[先生名]先生

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
`;
  }
}