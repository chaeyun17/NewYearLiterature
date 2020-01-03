'user strict';

/**
 * 전역 이벤트 관리 인스턴스
 */
var eventBus = new Vue();

/**
 * 메인 타이틀
 */
var MainTitle = {
  methods: {
    setAniMainTitle(){
      $('.ml3').each(function(){
        $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
      });
      
      anime.timeline({loop: true})
        .add({
          targets: '.ml3 .letter',
          opacity: [0,1],
          easing: "easeInOutQuad",
          duration: 2250,
          delay: function(el, i) {
            return 150 * (i+1)
          }
        }).add({
          targets: '.ml3',
          opacity: 0,
          duration: 1000,
          easing: "easeOutExpo",
          delay: 2000
        });
    }
  },
  mounted() {
    this.setAniMainTitle();
  },
};

/**
 * 작품 입력 컴포넌트
 */
var WorkInput = {
  props: ['work', 'displayWorkCanvas'],
  data(){
    return {}
  },
  methods: {
    limitArticleInput(){
      let str = this.work.article;
      let lines = this.work.article.split("\n");
      if(str.length > 60 | lines > 4){
        this.work.article = str.substring(0, 59);
      }
    },
    limitAuthorInput(){
      var str = this.work.author;
      if(str.length > 15){
        this.work.author = str.substring(0, 14);
      }
    },
    submitClickHandler(){
      this.$emit('completeInput');
    },
  },
  computed: {
    articleLength: function(){
      return this.work.article.length;
     }
  }
};

/**
 * 응모 컴포넌트
 */
var WorkSubmit = {
  props: ['work'],
  data(){
    return {
      host: 'http://localhost:8080',
      uri: '/api/works',
      user:{
        name: '',
        email: '',
        password: ''
      },
      emailErrorMsg: "",
      passwordErrorMsg: "",
      nameErrorMsg: ""
    };
  },
  methods: {
    submitHandler: function(){
      this.emailErrorMsg = "";
      this.passwordErrorMsg = "";
      this.nameErrorMsg = "";

      if(!this.isValidEmail()) {
        this.nameErrorMsg = "이름 입력을 확인해주세요";
        return;
      } 

      if(!this.isValidEmail()) {
        this.emailErrorMsg = "이메일 입력을 확인해주세요";
        return;
      } 

      if(!this.isValidPassword()){
        this.passwordErrorMsg = "비밀번호 형식에 맞춰 입력해주세요.";
        return;
      }

      this.submitWork();

    },
    isValidEmail: function(){
      let isValid = true;
      if(this.user.email === ""){
        isValid = false;
      }
      if(this.user.email.length > 256){
        isValid = false;
      }
      return isValid;
    },
    isValidPassword: function(){
      let isValid = true;
      if(this.user.password.length < 4 || this.user.password.length > 50){
        isValid = false;
      }
      return isValid;
    },
    submitWork: function(){
      let request = Object.assign({}, this.work);
      request.user = this.user;
      $.ajax({
        type: "POST",
        url: this.host + this.uri,
        data: JSON.stringify(request),
        dataType: 'json',
        contentType: 'application/json'
      })
      .done(this.successHandler)
      .fail(this.failHandler);
      setTimeout(()=>{
        eventBus.$emit('submitWork');
      }, 2000);
    },
    successHandler: function(work){
      this.$emit('submitwork', work);
      alert("소중한 작품 응모 감사합니다");
      $('#submission').modal('hide');
      this.initUserPassword();
    },
    failHandler: function(jqXhr, textStatus, errorThrown){
      alert("Error: " + textStatus + " : " + errorThrown);
    },
    initUserPassword(){
      this.user.password = "";
    }
  },
}


/**
 *  캔버스 이미지화 컴포넌트
 */
var WorkCanvas = {
  props:{
    'work': Object,
    'displayWorkCanvas': Boolean,
  },
  data() {
    return {
      canvas:{
        width: 300,
        height: 300
      },
      fabricManager: null,
      downloadBtn: {isHide: true},
    }
  },
  methods: {
    saveToImg: function(){
      let uri = this.fabricManager.getImgUri();
      this.downloadURI(uri, '제출작.png');
    },
    setFabricCanvas: function(){
      let canvasInfo = {
        id: 'workCanvas',
        width: this.canvas.width,
        height: this.canvas.height
      }
      this.fabricManager = new FabricManager(canvasInfo, "글을 담아보세요", "이름을 남겨주세요");
    },
    downloadURI: function(uri, filename){
      let link = document.createElement("a");
      link.download = filename;
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      link = null;
    },
    initCanvas: function(){
      this.fabricManager.initItext();
    },
    toggleSubmissionModal: function(){
        $('#submission').modal('toggle');
        this.downloadBtn.isHide = true;
        this.showCanvas();
    },
  },
  watch:{
    'work.article': function(article){
      this.fabricManager.updateArticleText(article);
    },
    'work.author': function(author){
      this.fabricManager.updateAuthorText(author);
    }
  },
  mounted() {
    this.setFabricCanvas();
  },
}

/**
 * 응모작 전시
 */
var WorkList = {
  props:{
  },
  data(){
    return {
      host: 'http://localhost:8080',
      workListUri: '/api/works',
      works: [{id: 0, article: '', author:''}],
    }
  },
  created() {
    this.getWorkList();
    eventBus.$on('submitWork', this.getWorkList);
  },
  methods: {
    getWorkList(author, sortt){
      $.ajax({
        type: "GET",
        url: this.host + this.workListUri,
        data: {
          author: author,
          sort: sortt
        },
        dataType: 'json',
      })
      .done((data)=>{
        this.works = data;
      })
      .fail((err)=>{
        console.warn(err);
      })
    },
  },
}



/**
 * ROOT
 */

var app = new Vue({
  el: '#app',
  components: {
    'main-title': MainTitle,
    'work-input': WorkInput,
    'work-submit': WorkSubmit,
    'work-canvas': WorkCanvas,
    'work-list': WorkList
  },
  data:{
      work:{
        article: "",
        author: "",
        user: {
          email: ""
        }
      },
      displayWorkCanvas: false,
  },
  created() {
  },
  methods: {
    articleInput(articleText){
      this.work.article = articleText;
    },
    authorInput(authorText){
      this.work.author = authorText;
    },
    completeInput(){
      $('#submission').modal('toggle');
    },
    toggleCanvas(){
      if(this.displayWorkCanvas){
        $("#step-2").slideUp("slow");
        this.displayWorkCanvas = false;
      }else{
        $("#step-2").slideDown("slow");
        this.displayWorkCanvas = true;
      }
    },
  },
  mounted() {
    
  },
});

