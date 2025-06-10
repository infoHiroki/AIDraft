// Gmail設定
const GMAIL_CONFIG = {
  // ラベル設定
  SOURCE_LABEL: 'AI回答要求',      // 処理対象ラベル
  TARGET_LABEL: 'AI自動回答_Gmail', // 処理済みラベル
  
  // 件名設定
  SUBJECT_PREFIX: 'Re: ',
  
  // 検索設定
  SEARCH_QUERY: {
    HAS_LABEL: 'label:AI回答要求',
    NOT_LABEL: '-label:AI自動回答_Gmail',
    UNREAD: 'is:unread'
  }
};