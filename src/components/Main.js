require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

//require 获取图片信息，commonjs规范
var imageDatas = require('../data/imageDatas.json');


imageDatas = (function genImageURL(imageDatasArr)
{
	for(var i=0,j=imageDatasArr.length;i<j;i++)
	{
		var singleImageData = imageDatasArr[i];
		
		singleImageData.imgURL = require('../images/'+singleImageData.fileName);
		
		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas)

class ImgFigure extends React.Component{
	
	render(){
		return(
			<figure className = "img-figure">
				<img src={this.props.data.imgURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">
					{this.props.data.title}
					</h2>
				</figcaption>
			</figure>
		);
	}
}

class AppComponent extends React.Component {
	
	Constant:{
		centerPos:{ //中心点
			left:0,
			right:0
		},
		hPosRange:{//水平方向的取值范围
			leftSecX:[0,0],
			rightSecX:[0,0],
			y:[0,0]
		}
		vPosRange:{//垂直方向的取值范围
			x:[0,0],
			topY:[0,0]
		}
	},
	
	/*
	 * 重新布局所有图片
	 * @param centerIndex 指定哪张图片居中
	*/
	rearrange: function(centerIndex){
		
	},
	
	//组件加载后，对坐标取值范围初始化
	componentDidMount:function(){
		
		//获取舞台大小
		//scrollWidth：对象的实际内容的宽度，不包边线宽度，会随对象中内容超过可视区后而变大。 
		//clientWidth：对象内容的可视区的宽度，不包滚动条等边线，会随对象显示大小的变化而改变。 
		//offsetWidth：对象整体的实际宽度，包滚动条等边线，会随对象显示大小的变化而改变。
		var stageDom = React.findDomNode(this.refs.stage),
			stageW = stageDom.scrollWidth,
			stageH = stageDom.scrollHeight,
			halfStageW = Math.ceil)(stageW/2),
			halfStageH = Math.ceil)(stageH/2);
		
		//拿到ImgFigure DOM的大小
		var imgFigureDom = React.findDomNode(this.refs.imgFigure0),
			imgW = imgFigureDom.scrollWidth,
			imgH = imgFigureDom.scrollHeight,
			halfImgW = Math.ceil)(imgW/2),
			halfImgH = Math.ceil)(imgH/2);
		
		//计算中心点的值
		this.Constant.centerPos = {
			left:halfStageW - halfImgW,
			top:halfStageH - halfImgH
		}
		
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW *3;
		this.Constant.hPosRange.RightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.RightSecX[1] = StageW - halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;
		
		this.Constant.hPosRange.topY[0] = -halfImgH;
		this.Constant.hPosRange.topY[1] = halfStageH-halfImgH*3;
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;

	},
	
	render() { 
	  
		var controllerUnits=[],
			imgFigures = [];
			
		imageDatas.forEach (function(value , index)
		{
			imgFigures.push(<ImgFigure data = {value} ref = {'imgFigure'+index} key={'imgFigure'+index}/>)
		});	

		return (
			<section className='stage' ref='stage'>
				<section className='img-sec'>
					{imgFigures}
				</section>
				<nav className='controller-nav'>
					{controllerUnits}
				</nav>
			</section>
		);
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
