// Gmail サービス
class GmailService {
  
  static createDraft(to, subject, body, labelName) {
    const draft = GmailApp.createDraft(to, subject, body);
    
    // ラベル付け
    if (labelName) {
      let label = GmailApp.getUserLabelByName(labelName);
      if (!label) {
        label = GmailApp.createLabel(labelName);
      }
      draft.getMessage().getThread().addLabel(label);
    }
    
    return draft.getId();
  }
  
  static getDraft(draftId) {
    try {
      return GmailApp.getDraft(draftId);
    } catch (error) {
      console.error(`下書き取得エラー (ID: ${draftId}):`, error);
      return null;
    }
  }
  
  static updateDraft(draftId, to, subject, body) {
    try {
      const draft = this.getDraft(draftId);
      if (draft) {
        draft.update(to, subject, body);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`下書き更新エラー (ID: ${draftId}):`, error);
      return false;
    }
  }
}