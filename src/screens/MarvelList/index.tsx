import React, { useState, useEffect} from 'react';
import {View,Text,FlatList,Modal, Image, RefreshControl,} from 'react-native';
import { styles } from './styles'
import AsyncStorage from '@react-native-async-storage/async-storage';
import md5 from 'md5';
import apiService from '../../services/requests'
import { HeroCard } from '../../components/HeroCard';
import {ModalStats} from '../../components/Modais/ModalStats'
import { ScrollView } from 'react-native-gesture-handler';

export interface Images{
    path:string,
    extension:string
}

export interface character{
    id: Number,
    name:string,
    description:string,
    modified:Date,
    thumbnail:Images,
}
export interface charactersList{
    id:Number,
    name:string,
    
}

export function MarvelList(){

    const [charactersList, setCharactersList] = useState<charactersList[]>([]);
    const [characterId, setCharacterId] = useState<Number>()
    const [loading, setLoading] = useState<boolean>(true);
    const [reload, setReload] = useState<boolean>(false);
    const [modalVisibility,setModalVisibility]=useState<boolean>(true);

    const [lastId, setLastId] = useState<Number>()

    //apagar depois
     AsyncStorage.setItem("@publicKey", "77e494c4516148e6430389b7f72228fc");
     AsyncStorage.setItem("@privateKey", "8368e5953e101d85c5ba546899972007fc3032fb")
    //
        async function auth() {
        
            const publicKey = await AsyncStorage.getItem("@publicKey");
            const privateKey = await AsyncStorage.getItem("@privateKey");
            const time = Number(new Date());
            const hash = md5(time + privateKey + publicKey)
            return ({publicKey,privateKey,time,hash})
        }
     useEffect(() => {
        setLoading(true);
        
             auth().then(async(res)=>{
                await apiService.getCharacters(res.time, res.publicKey, res.hash).then((res) => {
                    setCharactersList(res.data.data.results);
                    console.log(res.data.data.limit)
                }).catch(() => {
                    console.log("Erro")
                }).finally(() => setLoading(false));            
             })
    }, [reload]);

        return( 
        <View style={styles.container}>
            <Text style={styles.title}>Herois</Text>
             {loading ? 
                <Text style={styles.title}>...Loading...</Text>
                : 
                <FlatList
                    data={charactersList}
                    refreshControl={
                        <RefreshControl
                        refreshing={loading}
                        onRefresh={() => setReload(!reload)}
                        />
                    }
                    
                    renderItem={({ item }) => {
                        
                        return <HeroCard
                            setModalVisibility={setModalVisibility}
                            setCharacterId={setCharacterId}
                            item={item}
                        />
                    }}
                    // onEndReached={()=>{
                    //     setLastId(charactersList.pop().id)}}
                />
            }
            {characterId && <ModalStats
                CharacterId={characterId}
                ModalVisibility={modalVisibility}
                setModalVisibility={setModalVisibility}
            />
            }
        </View>
    )
}