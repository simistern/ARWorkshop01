"use strict";

import React, { Component, useState, useRef, useEffect } from "react";

import { StyleSheet } from "react-native";

import {
  ViroARScene,
  ViroText,
  Viro3DObject,
  ViroSphere,
  ViroARImageMarker,
  ViroARTrackingTargets,
  ViroMaterials,
  Viro360Image,
  ViroQuad,
  ViroARPlaneSelector,
  ViroDirectionalLight,
  ViroConstants,
  ViroPortal,
  ViroPortalScene,
  ViroBox
} from "react-viro";

const HelloWorldSceneAR = props => {
  let productResources;
  const ar3dModelRef = useRef(null);
  const planeSelector = useRef(null);

  let [viroAssets, setViroAssets] = useState([
    {
      id: "123",
      type: "OBJ",
      model: "https://s3.amazonaws.com/torontojs.arworkshop/ant.obj",
      resources: [
        {
          type: "roughnessTexture",
          uri: "https://s3.amazonaws.com/torontojs.arworkshop/antTexture.jpg"
        },
        {
          type: "metalnessTexture",
          uri: "https://s3.amazonaws.com/torontojs.arworkshop/antTexture.jpg"
        },
        {
          type: "diffuseTexture",
          uri: "https://s3.amazonaws.com/torontojs.arworkshop/antTexture.jpg"
        }
      ]
    }
  ]);
  let [sampleText, setSampleText] = useState("Hello TorontoJS!");
  // Set initial rotation
  const [rotation, setRotation] = useState([0, 0, 0]);

  // Set initial scale
  const [scale, setScale] = useState([0.005, 0.005, 0.005]);

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
    ViroARTrackingTargets.createTargets({
      targetOne: {
        source: require("./res/IMG_8702.png"),
        orientation: "Up",
        physicalWidth: 0.1 // real world width in meters
      }
    });

    ViroMaterials.createMaterials({
      modelMaterial: {
        lightingModel: "Lambert",
        ...materials
      }
    });
    productResources = viroAssets[0].resources.map(resource => resource.uri);
  }, [viroAssets]);
  const onRotate = (rotateState, rotationFactor, source) => {
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
    <ViroARScene
      dragType="FixedToWorld"
      >
      <ViroDirectionalLight
        color="#ffffff"
        direction={[0, -1, -2]}
        shadowOrthographicPosition={[0, 8, -2]}
        shadowOrthographicSize={5}
        shadowNearZ={1}
        shadowFarZ={4}
        castsShadow={true}
      />     
      <ViroARImageMarker target={"targetOne"}>
        <ViroBox 
              position={[0, 0, 0]} scale={[.01, .01, .01]} 
              height={2}
              length={2}
              width={2}
              />
      </ViroARImageMarker>

      <Viro3DObject
        source={{
          uri: viroAssets[0].model
        }}
        ref={ar3dModelRef}
        resources={[
          { uri: "https://s3.amazonaws.com/torontojs.arworkshop/ant.mtl" },
          {
            uri: "https://s3.amazonaws.com/torontojs.arworkshop/antTexture.jpg"
          }
        ]}
        onLoadEnd={data => {
          alert("Model Loaded");
        }}
        onError={event => {
          alert("Error: ", event);
        }}
        dragType="FixedToWorld"
        onPress={() => alert("you touched!")}
        onDrag={() => {}}
        scale={[0.5, 0.5, 0.5]}
        onRotate={onRotate}
        position={[0, -1, -1]}
        rotation={rotation}
        type={viroAssets[0].type}
        castsShadow={true}
      /> 
      <ViroText
        text={sampleText}
        scale={[0.5, 0.5, 0.5]}
        position={[0, 0, -1]}
        style={styles.helloWorldTextStyle}
      />
      <ViroPortalScene
        passable={true}
        position={[0, 0, -5]}
        dragType="FixedDistance"
        onDrag={() => {}}
      >
        <ViroPortal scale={[0.5, 0.5, 0.5]}>
          <Viro3DObject
            source={require("./res/portal_wood_frame.vrx")}
            resources={[
              require("./res/portal_wood_frame_diffuse.png"),
              require("./res/portal_wood_frame_normal.png"),
              require("./res/portal_wood_frame_specular.png")
            ]}
            type="VRX"
          />
        </ViroPortal>
        <Viro360Image source={require("./res/guadalupe_360.jpg")} />
      </ViroPortalScene> 
       <ViroARPlaneSelector ref={planeSelector}>
        <ViroBox
          position={[0, 1, -3]}
          height={1}
          width={1}
          length={1}
          physicsBody={{
            type: "dynamic",
            mass: 1
          }}
        />
        {viroAssets && (
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
            onPress={() => alert("you touched!")}
            onDrag={() => {}}
            scale={[0.5, 0.5, 0.5]}
            onRotate={onRotate}
            position={[0, -1, -1]}
            rotation={rotation}
            type={viroAssets[0].type}
            castsShadow={true}
          />
        )}
        <ViroQuad
          rotation={[90, 0, 0]}
          position={[0, -3, -1]}
          width={15}
          height={15}
          physicsBody={{
            type: "Static"
          }}
        />
      </ViroARPlaneSelector>
    </ViroARScene>
  );
};

var styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: "Arial",
    fontSize: 30,
    color: "#ffffff",
    textAlignVertical: "center",
    textAlign: "center"
  }
});

module.exports = HelloWorldSceneAR;
