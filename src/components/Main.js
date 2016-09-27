require('normalize.css/normalize.css');
require('styles/App.scss');
import ReactDOM from 'react-dom';
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

//获取区间内的随机值
function getRangeRandom(low,high){
	
	return Math.ceil(Math.random()*(high-low)+low)
}

//获取0-30°之间的任意正负值
function get30DegRandom(){
	
	return (Math.random()>0.5?'':'-')+Math.ceil(Math.random()*30)
}

class ImgFigure extends React.Component{
	
	/*
	 * 点击事件
	 */
	handleClick =(e)=>{
		
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center();
		}

		e.stopPropagation();
		e.preventDefault();
	}
	
	render(){
		
		var styleObj={};
		
		//如果props中指定了pos,则使用
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
		}
		//如果属性中有rotate,添加旋转
		if(this.props.arrange.rotate){
			styleObj['transform'] = 'rotate('+this.props.arrange.rotate+'deg)';
		}
		
		if(this.props.arrange.isCenter){
			styleObj.zIndex = 11;
		}
		
		var imgFigureClassName = 'img-figure';
			imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse':'';
		
		return(
			<figure className = {imgFigureClassName} style={styleObj} onClick = {this.handleClick}>
				<img src={this.props.data.imgURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back" onClick= {this.handleClick}>
						<p>
							{this.props.data.desc}
						</p>
					</div>
				</figcaption>
			</figure>
		);
	}
}

class AppComponent extends React.Component {
	
	constructor() {
		super();
		this.Constant = {
			
		  centerPos: {
			left: 0,
			right: 0
		  },
		  
		  hPosRange: { //水平方向的取值范围
			leftSecX: [0, 0],
			rightSecX: [0, 0],
			y: [0, 0]
		  },
		  
		  vPosRange: { //垂直方向
			x: [0, 0],
			topY: [0, 0]
		  }
		};
		
		this.state = {
			imgsArrangeArr : [
				/*{
					pos:{
						left:0,
						top:0
					},
					rotate:0,
					isInverse:false,
					isCenter:false
				}*/
			]
		};
	}
	/*
	 * 利用rearrnage 重新排布
	 * @param index输入被操作的图片对应的数组内的图片信息
	 * @return 闭包函数 
	 */
	center(index){
		return function(){
			this.rearrange(index);
		}.bind(this);
	}
  
	
	/*
	 * 反转图片
	 * @param index输入被操作的图片对应的数组内的图片信息
	 * @return 闭包函数 
	 */
	inverse(index){
		return function(){
			var imgsArrangeArr = this.state.imgsArrangeArr;
	 
			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
			
			this.setState({
				imgsArrangeArr : imgsArrangeArr
			})
	 
		}.bind(this);
	}
	
	/*
	 * 重新布局所有图片
	 * @param centerIndex 指定哪张图片居中
	*/
	rearrange(centerIndex){
		var Constant = this.Constant;
		var imgsArrangeArr = this.state.imgsArrangeArr,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRihgtSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,
			
			imgsArrangeTopArr = [],
			topImgNum = Math.ceil(Math.random()*2),  //值为0,1 取或者不取的意思
			
			topImgSpliceIndex = 0,
			
			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
			

			
		//居中centerIndex的图片
		imgsArrangeCenterArr[0] = {
			pos:centerPos,
			rotate:0,
			isCenter:true
		};
		
		//取出要布局上侧的图片状态信息
		topImgSpliceIndex = Math.ceil(Math.random()*(imgsArrangeArr.length-topImgNum));
		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
		
		//布局位于上侧的图片
		imgsArrangeTopArr.forEach(function(value,index){
			imgsArrangeTopArr[index] = {
				pos:{
					top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
					left: getRangeRandom(vPosRangeX[0],vPosRangeX[1])	
				},
				rotate:get30DegRandom(),
				isCenter:false
			}
		});
		
		//布局左右两侧的图片
		for(var i=0,j=imgsArrangeArr.length,k=j/2;i<j;i++){
			var hPosRangeLORX = null;
			//前半图片在左，后半在右
			if(i<k){
				hPosRangeLORX = hPosRangeLeftSecX;
			}else{
				hPosRangeLORX = hPosRangeRihgtSecX;
			}
			
			imgsArrangeArr[i]= {
				pos:{
					top: getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
					left: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
				},
				rotate:get30DegRandom(),
				isCenter:false
			}
		}
		
		if (imgsArrangeTopArr && imgsArrangeTopArr[0]){
			imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
		}
		
		imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
		
		this.setState({
			imgsArrangeArr : imgsArrangeArr  
		});
	}
	
	
	//组件加载后，对坐标取值范围初始化
	componentDidMount(){
		
		//获取舞台大小
		//scrollWidth：对象的实际内容的宽度，不包边线宽度，会随对象中内容超过可视区后而变大。 
		//clientWidth：对象内容的可视区的宽度，不包滚动条等边线，会随对象显示大小的变化而改变。 
		//offsetWidth：对象整体的实际宽度，包滚动条等边线，会随对象显示大小的变化而改变。
		var stageDom = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDom.scrollWidth,
			stageH = stageDom.scrollHeight,
			halfStageW = Math.ceil(stageW/2),
			halfStageH = Math.ceil(stageH/2);
		
		//拿到ImgFigure DOM的大小
		var imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDom.scrollWidth,
			imgH = imgFigureDom.scrollHeight,
			halfImgW = Math.ceil(imgW/2),
			halfImgH = Math.ceil(imgH/2);
		
		//计算中心点的值
		this.Constant.centerPos = {
			left:halfStageW - halfImgW,
			top:halfStageH - halfImgH
		}
		//计算左侧和右侧 图片排布的取值范围
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW *3;
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;
		//计算上侧 图片排布的取值范围，下侧为 图片控制nav
		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH-halfImgH*3;
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;
		
		this.rearrange(0);

	}
	
	render() { 
	  
		var controllerUnits=[],
			imgFigures = [];
			
		imageDatas.forEach (function(value , index)
		{
			if(!this.state.imgsArrangeArr[index]){
				this.state.imgsArrangeArr[index]={
					pos:{
						left:0,
						top:0
					},
					rotate:0,
					isInverse:false,
					isCenter:false
				}
			}
			
			imgFigures.push(<ImgFigure data = {value} ref = {'imgFigure'+index} key={'imgFigure'+index} 
				arrange= {this.state.imgsArrangeArr[index]} inverse = {this.inverse(index)} center={this.center(index)}/>)
		}.bind(this));	

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
