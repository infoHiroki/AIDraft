// AI サービス
class AIService {
  
  static generateEmailResponse(emailInfo) {
    const apiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error(COMMON_CONFIG.ERROR_MESSAGES.API_KEY_MISSING);
    }
    
    const prompt = `あなたはGDX事務局の中村です。お客様からのメールに対して、丁寧で専門的な返信を作成してください。

以下のメール情報を基に返信を作成してください：

【受信メール情報】
件名: ${emailInfo.subject}
送信者: ${emailInfo.from}
本文: ${emailInfo.body}

【返信作成指示】
1. 挨拶と感謝の表現から始める
2. お客様の質問や要望に対して具体的で有用な回答を提供
3. 必要に応じて追加の質問や確認事項を含める
4. 丁寧な締めくくりで終える
5. 署名を含める

【署名情報】
GDX事務局 中村
seminar@globaldentalx.com
03-4510-4792

【注意事項】
- 専門的だが理解しやすい言葉遣いを使用
- 相手の立場に立った回答を心がける
- 必要に応じて関連情報やリソースを提案

件名と本文を以下の形式で返してください：

件名: [返信件名]
本文:
[返信本文]`;

    const requestBody = {
      model: COMMON_CONFIG.OPENAI.MODEL,
      messages: [
        {
          role: "system",
          content: "あなたはGDX事務局の専門スタッフです。お客様に対して丁寧で有用な返信を作成します。"
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      max_tokens: COMMON_CONFIG.OPENAI.MAX_TOKENS,
      temperature: COMMON_CONFIG.OPENAI.TEMPERATURE
    };

    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(requestBody)
    };

    try {
      const response = UrlFetchApp.fetch('https://api.openai.com/v1/chat/completions', options);
      const responseData = JSON.parse(response.getContentText());
      
      if (responseData.error) {
        throw new Error(`OpenAI API エラー: ${responseData.error.message}`);
      }
      
      const aiResponse = responseData.choices[0].message.content;
      
      // 件名と本文を分離
      const subjectMatch = aiResponse.match(/件名:\s*(.+)/);
      const bodyMatch = aiResponse.match(/本文:\s*([\s\S]+)/);
      
      return {
        subject: subjectMatch ? subjectMatch[1].trim() : `Re: ${emailInfo.subject}`,
        body: bodyMatch ? bodyMatch[1].trim() : aiResponse
      };
      
    } catch (error) {
      console.error('OpenAI API呼び出しエラー:', error);
      throw new Error(`AI回答生成に失敗しました: ${error.message}`);
    }
  }
}