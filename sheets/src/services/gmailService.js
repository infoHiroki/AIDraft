/**
 * Gmailサービス
 * 統合版 - 下書き作成とラベル管理
 */
class GmailService {
  
  /**
   * Gmail下書きを作成
   * @param {string} to - 宛先メールアドレス
   * @param {string} subject - 件名
   * @param {string} body - 本文
   * @param {string} labelName - 付与するラベル名
   * @returns {string} 下書きID
   */
  static async createDraft(to, subject, body, labelName) {
    try {
      console.log(`Gmail下書き作成開始: ${to}`);
      
      // 下書き作成
      const draft = GmailApp.createDraft(to, subject, body);
      const draftId = draft.getId();
      
      // ラベル付与
      if (labelName) {
        this.addLabel(draft, labelName);
      }
      
      console.log(`Gmail下書き作成完了: ${draftId}`);
      return draftId;
      
    } catch (error) {
      console.error(`Gmail下書き作成エラー (to: ${to}):`, error);
      throw new Error(`${COMMON_CONFIG.ERROR_MESSAGES.GMAIL_ERROR}: ${error.message}`);
    }
  }
  
  /**
   * 下書きにラベルを付与
   * @param {GmailDraft} draft - Gmail下書きオブジェクト
   * @param {string} labelName - ラベル名
   */
  static addLabel(draft, labelName) {
    try {
      let label = GmailApp.getUserLabelByName(labelName);
      
      // ラベルが存在しない場合は作成
      if (!label) {
        console.log(`ラベル作成: ${labelName}`);
        label = GmailApp.createLabel(labelName);
      }
      
      // ラベルを付与
      draft.getMessage().getThread().addLabel(label);
      console.log(`ラベル付与完了: ${labelName}`);
      
    } catch (error) {
      console.error(`ラベル付与エラー (${labelName}):`, error);
      // ラベル付与に失敗しても下書き作成は成功とする
    }
  }
  
  /**
   * 下書きを取得
   * @param {string} draftId - 下書きID
   * @returns {GmailDraft|null} 下書きオブジェクト
   */
  static getDraft(draftId) {
    try {
      return GmailApp.getDraft(draftId);
    } catch (error) {
      console.error(`下書き取得エラー (ID: ${draftId}):`, error);
      return null;
    }
  }
  
  /**
   * 下書きの存在確認
   * @param {string} draftId - 下書きID
   * @returns {boolean} 存在するかどうか
   */
  static draftExists(draftId) {
    return this.getDraft(draftId) !== null;
  }
  
  /**
   * Gmail設定確認
   * @returns {Object} 確認結果
   */
  static checkGmailAccess() {
    try {
      // Gmail APIアクセス確認
      const drafts = GmailApp.getDrafts();
      
      const result = {
        accessible: true,
        draftCount: drafts.length,
        userEmail: Session.getActiveUser().getEmail()
      };
      
      console.log('Gmail設定確認完了:', result);
      return result;
      
    } catch (error) {
      console.error('Gmail設定確認エラー:', error);
      return {
        accessible: false,
        error: error.message
      };
    }
  }
}