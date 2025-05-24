import { Box, Button, Card, CardBody, Flex, FormControl, FormLabel, Heading, Input, Modal, ModalBody,
    ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Stack,
    Table, TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure, useToast,Select } from "@chakra-ui/react";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import useFirebase from "../hooks/useFirebase";//関数持ってくる
import { time } from "framer-motion";
import { onSnapshot, collection } from "firebase/firestore";

//import {doc, updateDoc} from "../firebase/firestore";
//import {db} from "../firebase";

const Home = () => {
    const { learnings ,calculateTotalTime,email,fetchDb,updateDb,deleteDb,handCreate,logout,editDb,GeminiTestasync} = useFirebase();
    const modalEdit = useDisclosure();
    const NewDate = useDisclosure();
    const toast = useToast();
    const [editLearning,setEditLearning] = useState({
        id: "",
        title: "",
        date: 0,
        time: 0,
        test: 0,//テスト用
        createAt: 0,
    });
    const [newLearning, setNewLearning] = useState({
        id: "",
        title: "",
        date: 0,
        time: 0,
        createAt: 0,
    });
    const [Gtext, setGtext] = useState("");
    const [selectedOption, setSelectedOption] = useState("");
    const [weight,getweight]=useState(60);
    const METS_TABLE = {
        "walking": 2.5,
        "running": 9.8,
        "cycling": 6.8,
        "gym": 6.0,
        "sonota":1.0,
    };
    const calculateCalories = (trainingType, weight, time) => {
    if (!METS_TABLE[trainingType]) return 0;
        return METS_TABLE[trainingType] * weight * (time / 60) * 1.05;
    };



    return (
        <>
            <Flex alignItems='center' justify='center' p={5}>
                <Card size={{ base: 'sm', md: 'lg' }}>
                    <Box textAlign='center' mb={2} mt={10}>
                        ようこそ！{email}さん
                    </Box>
                    <Heading size='md' textAlign='center'>あなたの運動記録</Heading>
                    <CardBody>
                        <Box textAlign='center'>
                            <TableContainer>
                                <Table variant='simple' size={{ base: 'sm', md: 'lg' }}>
                                    <Thead>
                                        <Tr>
                                            <Th>トレーニング内容</Th>
                                            <Th>時間(分)</Th>
                                            <Th>消費カロリー</Th>
                                            <Th></Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {learnings.map((item) => (
                                            <Tr key={item.id}>
                                                <Td>{item.title}</Td>
                                                <Td>{item.time}</Td>
                                                <Td>
                                                    <Button variant='ghost' onClick={() =>{
                                                        setEditLearning(item);//クリック時にデータをセット
                                                        modalEdit.onOpen();//モーダルを開く
                                                    }}>
                                                        <FiEdit color='black' />
                                                    </Button>
                                                </Td>
                                                <Td>
                                                    <Button variant='ghost' onClick={() => {
                                                        deleteDb(item.id);
                                                    }}>
                                                        <MdDelete color='black' />
                                                    </Button>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </Box>
                        {/* モーダルの実装 */}
                        <Modal isOpen={modalEdit.isOpen} onClose={modalEdit.onClose}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>運動内容の編集</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    <FormControl>
                                        <FormLabel>運動内容</FormLabel>
                                            <Select 
                                                value={editLearning.title || ""} 
                                                onChange={(e) => setEditLearning({ ...editLearning, title: e.target.value })} 
                                                >
                                                <option value="walking">ウォーキング</option>
                                                <option value="running">ランニング</option>
                                                <option value="cycling">サイクリング</option>
                                                <option value="gym">腹筋</option>
                                                <option value="sonota">その他</option>
                                            </Select>

                                        <FormLabel>運動時間</FormLabel>
                                        <Input
                                        type="number"
                                        value={editLearning.time || 0}
                                        onChange={(e) =>setEditLearning({ ...editLearning, time: e.target.value })}
                                        required
                                        />
                                    </FormControl>
                                    <Button colorScheme="blue" mr={3} onClick={async() => {
                                        editLearning.date=calculateCalories(editLearning.title,weight,editLearning.time)
                                        console.log("学習内容の更新:", editLearning);
                                        //updateDb(editLearning);
                                        editDb(editLearning);//モーダル内の処理
                                        //fetchDb(email);//バックからデータ取得
                                        modalEdit.onClose();
                                        toast({
                                            title: "データを更新しました!",
                                            status: "success",
                                            duration: 3000,
                                            isClosable: true
                                        });
                                    }}>
                                        確定
                                    </Button>
                                </ModalBody>
                            </ModalContent>
                             {/*新規データモーダル作成*/}
                        </Modal>
                        <Modal isOpen={NewDate.isOpen} onClose={NewDate.onClose}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>新規データ登録</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    <FormControl>
                                        <FormLabel>学習内容</FormLabel>
                                        <Select 
                                            value={newLearning.title || ""}
                                            onChange={(e) => {
                                                const selectedValue = e.target.value;
                                                setNewLearning((prev) => ({
                                                    ...prev,
                                                    title: selectedValue, // ✅ トレーニング内容を更新
                                                    date: calculateCalories(selectedValue, weight, prev.time), // ✅ 消費カロリーを計算＆格納
                                                }));
                                            }}
                                        >
                                            <option value="walking">ウォーキング</option>
                                            <option value="running">ランニング</option>
                                            <option value="cycling">サイクリング</option>
                                            <option value="gym">腹筋</option>
                                            <option value="sonota">その他</option>
                                        </Select>

                                        <FormLabel>学習時間 (分)</FormLabel>
                                        <Input
                                            type="number"
                                            value={newLearning.time || 0}
                                            onChange={(e) => {
                                                const timeValue = Number(e.target.value);
                                                setNewLearning((prev) => ({
                                                    ...prev,
                                                    time: timeValue, // ✅ 学習時間を更新
                                                    date: calculateCalories(prev.title, weight, timeValue), // ✅ 消費カロリーを計算＆格納
                                                }));
                                            }}
                                            required
                                        />
                                    </FormControl>

                                    <Button
                                        colorScheme="blue"
                                        mr={3}
                                        onClick={() => {
                                            console.log("新規データ登録:", newLearning);
                                            editDb(newLearning);
                                            NewDate.onClose();
                                            toast({
                                                title: "データを追加しました!",
                                                status: "success",
                                                duration: 3000,
                                                isClosable: true,
                                            });
                                        }}
                                    >
                                        確定
                                    </Button>
                                </ModalBody>
                            </ModalContent>
                        </Modal>
                        <Box p={5}>
                            <div>合計運動時間：{calculateTotalTime()}</div>
                        </Box>
                        <Box p={25}>
                            <Stack spacing={3}>
                                <Button
                                    colorScheme='green'
                                    variant='outline'
                                    onClick={NewDate.onOpen}
                                >新規データ登録
                                </Button>
                            </Stack>
                        </Box>
                        <Box px={25} mb={4}>
                            <Stack spacing={3}>
                                <Button
                                    width='100%'
                                    variant='outline'
                                    onClick={logout}
                                >ログアウト</Button>
                            </Stack>
                        </Box>

                        <Box px={25} mb={4}>
                            <Stack spacing={3}>
                                <input
                                    type="text"
                                    placeholder="Geminiに聞きたいことを入力"
                                    value={Gtext}
                                    onChange={(e) => setGtext(e.target.value)}
                                />
                                <Button
                                    width='100%'
                                    variant='outline'
                                    onClick={() => {GeminiTestasync(Gtext) }}
                                >質問</Button>
                            </Stack>

                        </Box>
                    </CardBody>
                </Card>
            </Flex>

        </>
        
    )
}
export default Home;