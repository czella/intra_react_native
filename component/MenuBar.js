import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {TouchableOpacity} from 'react-native';
import {HamburgerMenuIcon} from '../svg/Icons';

const MenuBar = props => {
  const {navigation, title} = props;
  return (
    <Container>
      <HamburgerContainer>
        <TouchableOpacity onPress={navigation.openDrawer}>
          <HamburgerMenuIcon />
        </TouchableOpacity>
      </HamburgerContainer>
      <TitleContainer>
        <Text>{title}</Text>
      </TitleContainer>
      <ImageContainer>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('../assets/logo_no_text.png')} />
        </TouchableOpacity>
      </ImageContainer>
    </Container>
  );
};

MenuBar.proptypes = {
  navigation: PropTypes.object,
  title: PropTypes.string,
};

MenuBar.defaultProps = {
  navigation: {},
  title: 'Title',
};

const Container = styled.View`
  height: 50px;
  background-color: #651fff;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;

const HamburgerContainer = styled.View`
  width: 45px;
`;

const TitleContainer = styled.View`
  display: flex;
  align-items: center;
  text-align: center;
`;

const Text = styled.Text`
  line-height: 50px;
  color: white;
  font-size: 25px;
`;

const Image = styled.Image`
  height: 30px;
  width: 30px;
  resize-mode: contain;
`;

const ImageContainer = styled.View`
  display: flex;
  align-items: center;
  width: 45px;
`;

export default MenuBar;
