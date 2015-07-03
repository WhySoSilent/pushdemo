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
		content.name = scene.name || "没有名称";
		if (scene.haveTTS) {
			content.dialog = [{
				"id" : 0,
				"question": {
				  "speech": scene.tts,
          "mode": "tts",
          "role": "female"
				}
			}];
		}
		if (scene.haveInteration && scene.interation == 'solicit') {
			content.feedback = {
				"state": "answer"
			}
		}

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
		var url = "http://121.201.13.32/xbot/v1/push/messages?user=" + Scene.targetBot;
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
	$scope.targetBot = Scene.targetBot;
	$scope.$watch('targetBot', function(n, o) {
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