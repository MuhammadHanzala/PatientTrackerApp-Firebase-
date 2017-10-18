//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, TextInput, TouchableHighlight, AsyncStorage } from 'react-native';
import { Container, Header, Right, Left, Body, Content, Item, Input, Button, Label } from 'native-base';
import { connect } from 'react-redux';
import EIcon from 'react-native-vector-icons/Entypo';
import FIcon from 'react-native-vector-icons/FontAwesome';
import { updateEntry, deleteEntry } from '../../store/middlewares/EntryMiddleware';
import fb from '../../firebase';
import Modal from 'react-native-modal'




function mapStateToProps(state) {
    return {

    }
}
function mapDispatchToProps(dispatch) {
    return {
        update: (newDetails, doctorId, callback) => dispatch(updateEntry(newDetails, doctorId, callback)),
        delete: (entry, doctorId, callback) => dispatch(deleteEntry(entry, doctorId, callback))

    }
}

// create a component
class PatientDetails extends Component {
    constructor(props) {
        super(props);
        const { name, disease, medication, cost, date } = this.props.navigation.state.params;
        this.state = {
            patient: this.props.navigation.state.params,
            name: name,
            disease: disease,
            medication: medication,
            cost: cost,
            date: date,
            editingMode: false,
            // modalVisible: false
        }
    }
    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
    async componentDidMount() {
        console.log(this.props.navigation.state.params);
        const doctor = await AsyncStorage.getItem('currentUser')
        const doctorId = (JSON.parse(doctor)).uid;

    }
    update = async () => {
        const { name, disease, medication, cost, date } = this.state;
        const doctor = await AsyncStorage.getItem('currentUser')
        const doctorId = (JSON.parse(doctor)).uid;
        if (name === '' || disease === '' || medication === '' || cost === null) {
            this.setState({ error: 'Please Enter Complete Details' });
        } else {
            const entryDetails = {
                name,
                disease,
                medication,
                cost,
                date: Date.now(),
                key: this.props.navigation.state.params.key
            }
            this.props.update(entryDetails, doctorId, () => { this.setState({ editingMode: false }) });
            // console.log(entryDetails)
        }
    }
    delete = async () => {
        const { name, disease, medication, cost, date } = this.state;
        const doctor = await AsyncStorage.getItem('currentUser')
        const doctorId = (JSON.parse(doctor)).uid;
        this.props.delete(this.props.navigation.state.params, doctorId, () => { this.props.navigation.navigate('HomePage') });
        // console.log(entryDetails)
    }

    render() {

        const { name, disease, medication, cost, date, patient } = this.state;
        return (
            <Container>
                <Header style={{ backgroundColor: '#e44747' }}>
                    <StatusBar
                        backgroundColor="rgba(0,0,0,1)"
                    />
                    <Left>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('HomePage') }}>
                            <View style={{ width: 40, }}>
                                <EIcon name="chevron-thin-left" style={{ color: '#fff', fontSize: 20 }} />
                            </View>
                        </TouchableOpacity>
                    </Left>
                    <Body>
                        <Text style={{ fontSize: 20, color: '#fff' }} >Patient Details</Text>
                    </Body>
                </Header>

                <Content style={styles.container}>
                    {
                        this.state.editingMode ?
                            <Body >
                                <Item floatingLabel style={{ marginBottom: 15 }}>
                                    <Label>Patient Name</Label>
                                    <Input value={name} onChangeText={(name) => { this.setState({ name: name }) }} />
                                </Item>
                                <Item floatingLabel style={{ marginBottom: 15 }}>
                                    <Label>Diseases</Label>
                                    <Input value={disease} onChangeText={(disease) => { this.setState({ disease: disease }) }} />
                                </Item>
                                <Item floatingLabel style={{ marginBottom: 15 }}>
                                    <Label>Medication</Label>
                                    <Input value={medication} onChangeText={(medication) => { this.setState({ medication: medication }) }} />
                                </Item>
                                <Item floatingLabel style={{ marginBottom: 15 }}>
                                    <Label>Cost</Label>
                                    <Input value={cost} onChangeText={(cost) => { this.setState({ cost: cost }) }} />
                                </Item>
                                <Button
                                    bordered
                                    rounded
                                    danger
                                    onPress={() => { this.update() }}
                                >
                                    <Text style={{ color: '#e44747', fontSize: 18, fontWeight: 'bold', }}> Save </Text>
                                </Button>
                            </Body>
                            :
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    // alignItems: 'center',
                                }}
                            >
                                <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                                    <TouchableOpacity onPress={() => { this.setState({ editingMode: true }) }}
                                    >
                                        <View style={{ width: 40, }}>
                                            <FIcon name="pencil-square" size={30} />
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { this.setModalVisible(true) }}
                                    >
                                        <View style={{ width: 40, }}>
                                            <FIcon name="trash-o" size={30} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <Modal
                                    isVisible={this.state.modalVisible}
                                    animationIn={'slideInLeft'}
                                    animationOut={'slideOutRight'}
                                    style={{
                                        flex: 0.3,
                                        backgroundColor: 'white',
                                        alignItems: 'center',

                                        padding: 22,
                                        justifyContent: 'center',
                                        borderRadius: 4,
                                        borderColor: 'rgba(0, 0, 0, 0.1)',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <View style={{
                                        flex: 1,
                                        width: '100%',
                                        backgroundColor: '#fff',
                                        padding: 22,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 4,
                                        borderColor: 'rgba(0, 0, 0, 0.1)',
                                    }}>
                                        <View style={{ minHeight: 10 }}>
                                            <Text>Are you sure, you want to Delete ?</Text>
                                            <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: 10 }}>
                                                <Button light style={{ marginRight: 10 }}>
                                                    <Text onPress={() => this.setState({ modalVisible: false })}> No </Text>
                                                </Button>
                                                <Button danger onPress={() => this.delete()}>
                                                    <Text> Yes </Text>
                                                </Button>
                                            </View>


                                        </View>
                                    </View>
                                </Modal>

                                <View style={{ flex: 1, marginLeft: 10 }}>
                                    <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                                        <Text style={{ fontSize: 18 }}>Name: </Text>
                                        <Text style={{ fontSize: 20 }}>{patient.name}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                                        <Text style={{ fontSize: 18 }}>Diseases: </Text>
                                        <Text style={{ fontSize: 20 }}>{patient.disease}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                                        <Text style={{ fontSize: 18 }}>Medication: </Text>
                                        <Text style={{ fontSize: 20 }}>{patient.medication}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                                        <Text style={{ fontSize: 18 }}>Cost: </Text>
                                        <Text style={{ fontSize: 20 }}>{patient.cost}</Text>
                                    </View>
                                </View>

                            </View>
                    }
                </Content>
            </Container >
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,

        marginTop: 30,
    },
    content: {


    },
    input: {
        marginBottom: 40
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center'
    },

    modal2: {
        height: 230,
        backgroundColor: "#3B5998"
    },

    modal3: {
        height: 300,
        width: 300
    },
});

//make this component available to the app
export default connect(mapStateToProps, mapDispatchToProps)(PatientDetails);
