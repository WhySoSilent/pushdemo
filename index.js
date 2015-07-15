var ConfigModule = angular.module('config', [])
.factory('Config', ['$http',function($http){
	/* 描述信息
	Config = {
		version: 1,
		// 有哪些类型的交互,数组内第一个是默认
		interactiveType: [
			{ value: "solicit", des: "征询用户意愿"}
		],
		// 有哪些类型的动作
		actionType: [
			{ value: "tts", des: "TTS播报"},
			{ value: "audio", des: "媒体播放"}
		],
		// 可以播放的媒体信息，需要从后台获取
		mediaList: {
			music: [],
			boardcast: [],
			news: []
		}
	} */
	var Config = {
		version: 1,
		interactiveType: [
			{ value: "solicit", des: "征询用户意愿"},
			{ value: "select", des: "选取"}
		],
		actionType: [
			{ value: "tts", des: "TTS播报"},
			{ value: "audio", des: "媒体播放"}
		]
	}

	Config.getVersion = function() {
		return this.version;
	}
	Config.getInteractiveType = function() {
		return this.interactiveType;
	}
	Config.getActionType = function() {
		return this.actionType;
	}
	return Config;
}]);
var SceneModule = angular.module('scene', [])
.factory('Scene', [function(){
	/* 描述信息
	Scene = {
		version: 1,
		scenes: [
			{
				haveTTS: true,
				haveInteration: true,
				haveAction: true,
				name: "___",
				tts: "___",
				interation: "solicit|select"
			}
		]
	} */
	var Service = { version: 1 };
	Service.scenes = JSON.parse(localStorage.getItem("scenes")) || initData();
	Service.targetBot = localStorage.getItem("targetBot") || "";
	// var Service.scenes = {
	// 	scenes: [	// 从本地存储存取
	// 		{
	// 			haveTTS: true,
	// 			haveInteration: true,
	// 			haveAction: true,
	// 			name: "早高峰上班",
	// 			tts: "好听记得收藏哦~",
	// 			interation: "solicit"
	// 		},
	// 		{
	// 			haveTTS: true,
	// 			haveInteration: false,
	// 			haveAction: true,
	// 			name: "晚高峰下班",
	// 			tts: "好听记得收藏哦~",
	// 			interation: "solicit"
	// 		},
	// 		{
	// 			haveTTS: true,
	// 			haveInteration: false,
	// 			haveAction: false,
	// 			name: "下雨天",
	// 			tts: "好听记得收藏哦~",
	// 			interation: "solicit"
	// 		},
	// 		{
	// 			haveTTS: true,
	// 			haveInteration: true,
	// 			haveAction: false,
	// 			name: "长途驾驶",
	// 			tts: "好听记得收藏哦~",
	// 			interation: "solicit"
	// 		}
	// 	]
	// }

	Service.getVersion = function() {
		return Service.version;
	}
	Service.addScene = function(newOne) {
		Service.scenes.push(newOne);
	}
	Service.addAction = function(newOne, witch, sceneIndex) {
		Service.scenes[sceneIndex][witch].push(newOne);
	}
	Service.getScenes = function() {
		return Service.scenes;
	}
	// 删除方法
	Service.deleteOne = function(target) {
		for(var i = 0, n = Service.scenes.length; i < n; i++ ) {
			if (Service.scenes[i] == target) {
				Service.scenes.splice(i, 1);
				return;
			}
		}
	}
	// 生成一个默认场景
	Service.addDefaultScene = function() {
		var newOne = {
			haveTTS: true,
			haveInteration: false,
			haveAction: false,
			name: "点击修改名称",
			tts: "小宝好开心~",
			interation: "solicit",
			resYes: [
				{type: 'tts', value: "好的"},
				// {type: 'audio', value: "http://", des: "李荣浩-作曲家"}
			],
			resNo: [
				{type: 'tts', value: "那好吧"}
			],
			defAction: [
				{type: 'tts', value: "都不理我"}
			],
			action:[]
		}
		this.addScene(newOne);
		return newOne;
	}
	function initData() {
		return [	// 从本地存储存取
			{
				haveTTS: true,
				haveInteration: false,
				haveAction: false,
				name: "推送示例",
				tts: "小宝好开心",
				interation: "solicit",
				resYes: [],
				resNo: [],
				defAction: [],
				action:[]
			}
		]
	}
	//添加一个新动作
	Service.addNewAction = function(witch, sceneIndex) {
		var newOne = {
			type: "tts",
			value: "点击这里修改"
			//... des
		}
		this.addAction(newOne, witch, sceneIndex);
		return newOne;
	}
	// 删除一个动作
	Service.deleteOneAction = function(scene, action) {
		for(var i = 0, n = scene.resYes.length; i < n; i++ ) {
			if (scene.resYes[i] == action) {
				scene.resYes.splice(i, 1);
				return;
			}
		}
		for(var i = 0, n = scene.resNo.length; i < n; i++ ) {
			if (scene.resNo[i] == action) {
				scene.resNo.splice(i, 1);
				return;
			}
		}
		for(var i = 0, n = scene.defAction.length; i < n; i++ ) {
			if (scene.defAction[i] == action) {
				scene.defAction.splice(i, 1);
				return;
			}
		}
		for(var i = 0, n = scene.action.length; i < n; i++ ) {
			if (scene.action[i] == action) {
				scene.action.splice(i, 1);
				return;
			}
		}
	}
	// 持久化
	Service.save = function() {
		if (Service.scenes.length == 0) {
			localStorage.removeItem("scenes");
			return;
		}
		localStorage.setItem("scenes", JSON.stringify(Service.scenes));
	}
	Service.saveTargetBot = function(value) {
		localStorage.setItem("targetBot", value);
	}
	return Service;
}]);
var BuildModule = angular.module('build', ['scene'])
.factory('Build', ['$http', 'Scene', function($http, Scene){
	/* 描述信息
	*/
	var Build = {
		version: 1,
	}

	Build.getVersion = function() {
		return this.version;
	}
	Build.buildScript = function(scene) {
		if ( Scene.targetBot == '') {
			alert("请填写目标设备的ID");
			return;
		}
		var content = {};
		content.id = "qw23er";		//随机生成的id
		content.type = "audio-dest";
		content.name = scene.name || "没有名称";
		content.inBackground = false;	//默认都是不显示监听页面的,需要设置dialog.display
		content.autoClose = true;			//交互对话结束后自动关闭界面
		content.priority = 80;		//推送优先级，娱乐类暂时统一设计为 80
		content.desc = false;			//同优先级不插队
		content.expired = "2015-08-10T09:48:57+08:00";	//有效期，具体到时刻

		content.dialog = [{
			"id" : 0,
			"timeout": "5000",				//用户超过5s不响应视为超时 	//!!! 放在这里不合适
			"display":{ 							//显示，当"display"有设置，且"inBackground"为"false"时，显示一个提示界面
				"title":"有内容更新啦",		//提示界面下方标题
				"content":"小宝推荐"			//提示界面中央的提示内容主题
			}
		}];

		if (scene.haveTTS) {
			//语音消息，如果有"speech",接收到消息后会先说以下的语音                        
			content.dialog[0].speech = {
				"mode": "tts",
				"content": "小宝收到一条目的地，是否立即开始导航",	
				"role": "male"	//目前仅支持"male", "female"
			}
		}
		if (scene.haveInteration) {
			//人机交互，如果有"expectedAnswer",会触发语音交互
			content.dialog[0].expectedAnswer = [
				//预置答案，可以填com.tuyou.tsd.voice.service.VoiceCommand中的CommonMessage，也可以填自定义文本
				"tsd.command.NEGATIVE",		//肯定回复，"不好"之类
				"tsd.command.POSITIVE",		//否定回复，"好"之类
				//还可以添加自定义答案
      ];
      content.dialog[0].onSuccess = [{"value": "tsd.command.POSITIVE"},{"value": "tsd.command.NEGATIVE"}];
      //用户肯定回复
      (function(){
	    	var i,len = scene.resYes.length;
	    	if( len == 0 ) return;
	    	//设置tts
	    	for(i = 0; i < len; i++ ) {
	    		var action = scene.resYes[i];
					if(action.type == "tts") {
						content.dialog[0].onSuccess[0].speech = {
        			"role": "male",
    		    	"content": action.value,
							"mode": "tts"
   			 		}
					}
					content.dialog[0].onSuccess[0].action = "return";	//初始值为return
					if(action.type == "audio") {
						content.dialog[0].onSuccess[0].message = "tsd.event.push.audio_category";
						content.dialog[0].onSuccess[0].action = "end";
            content.dialog[0].onSuccess[0].params = {
     					"type": "music",
         			"url": "/xbot/v1/audio/manager/category?category=a7d03ba4-8c1b-4c84-8d34-328b0289d746"
     				}
					}
				}
      })();
			//用户否定回复
      (function(){
	    	var i,len = scene.resNo.length;
	    	if( len == 0 ) return;
	    	//设置tts
	    	for(i = 0; i < len; i++ ) {
	    		var action = scene.resNo[i];
					if(action.type == "tts") {
						content.dialog[0].onSuccess[1].speech = {
        			"role": "male",
    		    	"content": action.value,
							"mode": "tts"
   			 		}
					}
					content.dialog[0].onSuccess[1].action = "return";	//初始值为return
					if(action.type == "audio") {
						content.dialog[0].onSuccess[1].message = "tsd.event.push.audio_category";
						content.dialog[0].onSuccess[1].action = "end";
            content.dialog[0].onSuccess[1].params = {
     					"type": "music",
         			"url": "/xbot/v1/audio/manager/category?category=a7d03ba4-8c1b-4c84-8d34-328b0289d746"
     				}
					}
				}
				//设置播放
				
      })();

      content.dialog[0].onFailed = [
      	{"reason": "ERR_NO_SPEECH"},
      	{
      		"action": "return",
	        "reason": "ERR_NO_MATCH_ANSWER_ON_PUSH",
          "speech": {
        		"role": "male",
    		    "content": "老大，你真逗，小宝退下了",
						"mode": "tts"
     		 }},
      	{
      		"action": "return",
          "reason": "ERR_USER_CANCELLED",
          "speech": {
        		"role": "xbot",
    		    "content": "哦",
						"mode": "tts"
     		 }}
     	];
     	(function(){
	    	var i,len = scene.defAction.length;
	    	if( len == 0 ) return;
	    	//设置tts
	    	for(i = 0; i < len; i++ ) {
	    		var action = scene.defAction[i];
					if(action.type == "tts") {
						content.dialog[0].onFailed[0].speech = {
        			"role": "male",
    		    	"content": action.value,
							"mode": "tts"
   			 		}
					}
					content.dialog[0].onSuccess[0].action = "return";	//初始值为return
					if(action.type == "audio") {
						content.dialog[0].onSuccess[0].message = "tsd.event.push.audio_category";
						content.dialog[0].onSuccess[0].action = "end";
            content.dialog[0].onSuccess[0].params = {
     					"type": "music",
         			"url": "/xbot/v1/audio/manager/category?category=a7d03ba4-8c1b-4c84-8d34-328b0289d746"
     				}
					}
				}
      })();
		}
		// if (scene.haveInteration && scene.interation == 'solicit') {
		// 	content.feedback = {
		// 		"state": "answer"
		// 	}
		// }

		var script = {
	    "sender": "self",
	    "timestamp": new Date().toJSON(),
	    "timeout": 1800,
	    "message": {
	        "module": "interaction",
	        "type": "interaction",
	        "content": JSON.stringify(content)
	    }
		}
		Build.send(script);
		
	}
	Build.send = function (script) {
		//var url = "http://121.201.13.32/xbot/v1/push/messages?user=" + Scene.targetBot;
		var url = "http://www.tuxiaobao.me/xbot/v1/push/issued/messages?user=" + Scene.targetBot;
		$http.post(url, script).success(function() {
			alert("已经触发");
		});
	}

	return Build;
}]);
var Angu = angular.module('main', ['config','build', 'scene']);
Angu.controller('mainController', [ '$scope', '$timeout', 'Config', 'Build', 'Scene', function($scope, $timeout, Config, Build, Scene) {
	// data
  $scope.scenes = Scene.getScenes();
	$scope.scene = null;
	$scope.SceneServer = Scene;
	$scope.$watch('SceneServer.targetBot', function(n, o) {
			if ( n==o ) return;
			Scene.saveTargetBot(n);
		});
	// 支持的交互类型
	$scope.interactiveType = Config.getInteractiveType();
	$scope.editTitle = false;
	$scope.watch = null;
	// action相关的
	$scope.action = null;
	$scope.actionType = Config.getActionType();


	$scope.toggleThe = function (target) {
		$scope.scene[target] = !$scope.scene[target];
	}
	$scope.editThis = function(index) {
		$scope.scene = $scope.scenes[index];
		$scope.watch = $scope.$watch('scene', function() {
			Scene.save();
		}, true);
	}
	$scope.exitEditing = function() {
		// 1. 先取消对该scene的监听
		// 2. 退出编辑
		$scope.watch();
		$scope.scene = null;
		$scope.editTitle = false;
	}
	$scope.sendThis = function(index) {
		Build.buildScript($scope.scenes[index]);
	}
	$scope.addNewScene = function() {
		$scope.scene = Scene.addDefaultScene();
		$scope.watch = $scope.$watch('scene', function() {
			Scene.save();
		}, true);
	}
	$scope.toEditTitle = function () {
		$scope.editTitle = true;
	}
	$scope.removeThis = function() {
		Scene.deleteOne($scope.scene);
		Scene.save();
		$scope.exitEditing();
	}
	//action相关
	$scope.editThisAction = function(index, actionType) {
		$scope.action = $scope.scene[actionType][index];
	}
	// 退出Action的编辑操作
	$scope.exitActionEditing = function() {
		$scope.action = null;
	}
	$scope.addAction = function(forWitch) {
		for(var i = 0, n = $scope.scenes.length; i < n; i++ ) {
			if ($scope.scenes[i] == $scope.scene) {
				$scope.action = Scene.addNewAction(forWitch, i);
				return;
			}
		}
	}
	//... removeThisAction
	$scope.removeThisAction = function() {
		Scene.deleteOneAction($scope.scene, $scope.action);
		$scope.action = null;
	}
}]);