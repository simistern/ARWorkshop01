'use strict';

import React, { Component, useState, useRef, useEffect} from 'react';

import {StyleSheet} from 'react-native';

import {
  ViroARScene,
  ViroText,
  Viro3DObject,
  ViroMaterials,
  ViroARPlaneSelector,
  ViroDirectionalLight,
  ViroConstants,
} from 'react-viro';

const HelloWorldSceneAR = (props) => {
    let productResources;
    const ar3dModelRef = useRef(null);
    const planeSelector = useRef(null);

    let [viroAssets, setViroAssets] = useState([
      {
          id: "123",
          type: 'OBJ',
          model:
          "https://s3-us-west-2.amazonaws.com/ar-files-vnovick/Lamborghini_Aventador.obj",
          resources: [
            {
              type: "roughnessTexture",
              uri:
                "https://s3-us-west-2.amazonaws.com/ar-files-vnovick/Lamborginhi+Aventador_gloss.jpeg"
            },
            {
              type: "metalnessTexture",
              uri:
                "https://s3-us-west-2.amazonaws.com/ar-files-vnovick/Lamborginhi+Aventador_spec.jpeg"
            },
            {
              type: "diffuseTexture",
              uri:
                "https://s3-us-west-2.amazonaws.com/ar-files-vnovick/Lamborginhi+Aventador_diffuse.jpeg"
            }      
          ]
      }
    ]);    
    let [sampleText, setSampleText ] = useState("Hello TorontoJS!")
     // Set initial rotation
    const [rotation, setRotation] = useState([
      0,
      0,
      0
    ]);

    // Set initial scale
    const [scale, setScale] = useState([
      0.005,
      0.005,
      0.005,
    ]);

    useEffect(() => {  
      const materials = viroAssets[0].resources.reduce(
        (acc, resource) => ({
          ...acc,
          [resource.type]: {
            uri: resource.uri
          }
        }),
        {}
      );
      ViroMaterials.createMaterials({
        modelMaterial: {
          lightingModel: "Lambert",
          ...materials
        }
      });        
      productResources = viroAssets[0].resources.map(
        resource => resource.uri
      );  
    }, [viroAssets]);
    const onRotate = (
      rotateState,
      rotationFactor,
      source
    ) => {
        const newRotation = scale.map((x, index) => {
          return index === 1 ? x - rotationFactor : x;
        });
    
        if (rotateState == 3) {
          setRotation(newRotation);
          return;
        }
        //update rotation using setNativeProps
        ar3dModelRef.current.setNativeProps({
          rotation: newRotation
        });
    };
    return (
      <ViroARScene>
        <ViroDirectionalLight
            color="#ffffff"
            direction={[0, -1, -2]}
            shadowOrthographicPosition={[0, 8, -2]}
            shadowOrthographicSize={5}
            shadowNearZ={1}
            shadowFarZ={4}
            castsShadow={true}
          />
        <ViroText text={sampleText} scale={[.5, .5, .5]} position={[0, 0, -1]} style={styles.helloWorldTextStyle} />        
        <ViroARPlaneSelector
           ref={planeSelector}
          >
          {(viroAssets) &&         
            <Viro3DObject
              source={{
                uri: viroAssets[0].model
              }}
              materials={["modelMaterial"]}

              ref={ar3dModelRef}
              resources={productResources}
              onLoadEnd={data => {
                alert("Model Loaded");
              }}
              onError={event => {
                alert("Error: ", event);              
              }}
              onPress={() => alert('you touched!')}            
              onDrag={() => {}}
              scale={scale}
              onRotate={onRotate}
              position={[0,-1,-1]}
              rotation={rotation}
              type={viroAssets[0].type}
              castsShadow={true}
            />} 
        </ViroARPlaneSelector>     
      </ViroARScene>
    );
}

var styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',  
  },
});

module.exports = HelloWorldSceneAR;
