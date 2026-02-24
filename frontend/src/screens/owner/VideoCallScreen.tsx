import React, { useState, useEffect, useRef } from "react";
import {
    View, Text, StyleSheet, Pressable, TextInput,
    ScrollView, KeyboardAvoidingView, Platform,
    Animated, Dimensions, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { colors, spacing, typography, radii } from "@/src/theme";
import { PALETTE } from "@/src/components/owner/home/styles";

const { width, height } = Dimensions.get("window");

interface ChatMessage {
    id: string;
    sender: "me" | "pro";
    text: string;
    time: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
    { id: "1", sender: "pro", text: "Bonjour ! Je suis Marc Dubois, plombier-chauffagiste. Comment puis-je vous aider ?", time: "10:02" },
    { id: "2", sender: "me", text: "Bonjour ! Mon chauffage ne fonctionne plus depuis hier soir.", time: "10:03" },
    { id: "3", sender: "pro", text: "D'accord. Pouvez-vous me montrer le tableau de bord de votre chaudière via la caméra ?", time: "10:03" },
];

export default function VideoCallScreen() {
    const { proName } = useLocalSearchParams<{ proName: string }>();
    const name = proName || "Marc Dubois";

    const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
    const [chatInput, setChatInput] = useState("");
    const [showChat, setShowChat] = useState(false);
    const [micMuted, setMicMuted] = useState(false);
    const [camOff, setCamOff] = useState(false);
    const [duration, setDuration] = useState(0);
    const [isConnected, setIsConnected] = useState(false);

    const pulseAnim = useRef(new Animated.Value(1)).current;
    const scrollRef = useRef<ScrollView>(null);

    // Simulate connection after 1.5s
    useEffect(() => {
        const t = setTimeout(() => setIsConnected(true), 1500);
        return () => clearTimeout(t);
    }, []);

    // Timer
    useEffect(() => {
        if (!isConnected) return;
        const t = setInterval(() => setDuration(s => s + 1), 1000);
        return () => clearInterval(t);
    }, [isConnected]);

    // Pulse animation for "connecting"
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.15, duration: 800, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const fmtTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

    const sendMessage = () => {
        if (!chatInput.trim()) return;
        const msg: ChatMessage = { id: Date.now().toString(), sender: "me", text: chatInput.trim(), time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) };
        setMessages(p => [...p, msg]);
        setChatInput("");
        // Simulate pro typing+response after 1.5s
        setTimeout(() => {
            setMessages(p => [...p, {
                id: Date.now().toString(), sender: "pro",
                text: "Je comprends. Pouvez-vous vérifier la pression sur le manomètre de la chaudière ?",
                time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
            }]);
        }, 1800);
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    };

    const handleEndCall = () => {
        Alert.alert("Terminer la session ?", "La session sera enregistrée dans votre dossier.", [
            { text: "Continuer", style: "cancel" },
            { text: "Terminer", style: "destructive", onPress: () => router.back() },
        ]);
    };

    return (
        <View style={s.root}>
            <StatusBar style="light" hidden />

            {/* ── Remote Video (simulated background) ── */}
            <View style={s.remoteVideo}>
                {isConnected ? (
                    <View style={s.connectedBg}>
                        {/* Simulated "video" gradient */}
                        <View style={s.videoBg}>
                            <Ionicons name="person-circle" size={90} color="rgba(255,255,255,0.15)" />
                            <Text style={s.remoteName}>{name}</Text>
                            <View style={s.remoteStatus}>
                                <View style={s.greenDot} />
                                <Text style={s.remoteStatusTxt}>En ligne · {fmtTime(duration)}</Text>
                            </View>
                        </View>
                    </View>
                ) : (
                    <View style={s.connectingBg}>
                        <Animated.View style={[s.pulsering, { transform: [{ scale: pulseAnim }] }]} />
                        <Ionicons name="person-circle" size={70} color="rgba(255,255,255,0.4)" />
                        <Text style={s.connectingTxt}>Connexion en cours…</Text>
                    </View>
                )}
            </View>

            {/* ── Local Video (self-view PiP) ── */}
            <View style={s.localVideo}>
                {camOff ? (
                    <View style={s.camOffBox}>
                        <Ionicons name="videocam-off" size={18} color="rgba(255,255,255,0.5)" />
                    </View>
                ) : (
                    <View style={s.localVideoInner}>
                        <Ionicons name="person" size={24} color="rgba(255,255,255,0.6)" />
                        <Text style={s.localLabel}>Vous</Text>
                    </View>
                )}
            </View>

            {/* ── Top Bar ── */}
            <SafeAreaView edges={["top"]} style={s.topBar}>
                <View style={s.topBarInner}>
                    <View>
                        <Text style={s.callWith}>Visio avec</Text>
                        <Text style={s.callName}>{name}</Text>
                    </View>
                    {isConnected && (
                        <View style={s.timerBadge}>
                            <View style={s.greenDot} />
                            <Text style={s.timerTxt}>{fmtTime(duration)}</Text>
                        </View>
                    )}
                </View>
            </SafeAreaView>

            {/* ── Chat panel (slide up) ── */}
            {showChat && (
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    style={s.chatPanel}
                >
                    <View style={s.chatHeader}>
                        <Text style={s.chatHeaderTxt}>Chat</Text>
                        <Pressable onPress={() => setShowChat(false)}>
                            <Ionicons name="chevron-down" size={20} color="rgba(255,255,255,0.7)" />
                        </Pressable>
                    </View>
                    <ScrollView ref={scrollRef} style={s.chatScroll} contentContainerStyle={{ gap: 8, padding: spacing.sm }}>
                        {messages.map(m => (
                            <View key={m.id} style={[s.bubble, m.sender === "me" ? s.bubbleMe : s.bubblePro]}>
                                <Text style={[s.bubbleTxt, m.sender === "me" ? s.bubbleTxtMe : s.bubbleTxtPro]}>{m.text}</Text>
                                <Text style={s.bubbleTime}>{m.time}</Text>
                            </View>
                        ))}
                    </ScrollView>
                    <View style={s.chatInput}>
                        <TextInput
                            style={s.chatTextInput}
                            value={chatInput}
                            onChangeText={setChatInput}
                            placeholder="Votre message…"
                            placeholderTextColor="rgba(255,255,255,0.4)"
                            onSubmitEditing={sendMessage}
                            returnKeyType="send"
                        />
                        <Pressable style={s.sendBtn} onPress={sendMessage}>
                            <Ionicons name="send" size={16} color="#fff" />
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            )}

            {/* ── Controls ── */}
            <SafeAreaView edges={["bottom"]} style={s.controls}>
                <View style={s.controlsRow}>
                    {/* Mic */}
                    <ControlBtn
                        icon={micMuted ? "mic-off" : "mic"}
                        label={micMuted ? "Micro off" : "Micro"}
                        onPress={() => setMicMuted(p => !p)}
                        active={!micMuted}
                    />
                    {/* Camera */}
                    <ControlBtn
                        icon={camOff ? "videocam-off" : "videocam"}
                        label={camOff ? "Caméra off" : "Caméra"}
                        onPress={() => setCamOff(p => !p)}
                        active={!camOff}
                    />
                    {/* Chat */}
                    <ControlBtn
                        icon="chatbubble"
                        label="Chat"
                        onPress={() => setShowChat(p => !p)}
                        active={showChat}
                        badge={messages.length}
                    />
                    {/* Share */}
                    <ControlBtn
                        icon="attach"
                        label="Document"
                        onPress={() => Alert.alert("Partage", "Sélectionnez un document à partager avec l'expert.")}
                        active={false}
                    />
                    {/* End call */}
                    <ControlBtn
                        icon="call"
                        label="Terminer"
                        onPress={handleEndCall}
                        danger
                    />
                </View>
            </SafeAreaView>
        </View>
    );
}

// ─── ControlBtn ───────────────────────────────────────────────────────────────
function ControlBtn({ icon, label, onPress, active, danger, badge }: {
    icon: any; label: string; onPress: () => void;
    active?: boolean; danger?: boolean; badge?: number;
}) {
    const bg = danger
        ? colors.semantic.danger
        : active
            ? "rgba(255,255,255,0.2)"
            : "rgba(255,255,255,0.08)";

    return (
        <Pressable style={s.controlBtn} onPress={onPress}>
            <View style={[s.controlBtnIcon, { backgroundColor: bg }]}>
                <Ionicons name={danger ? "call" : icon} size={22} color={danger ? "#fff" : active ? "#fff" : "rgba(255,255,255,0.6)"} />
                {badge !== undefined && badge > 0 && (
                    <View style={s.badgeDot}><Text style={s.badgeDotTxt}>{badge}</Text></View>
                )}
            </View>
            <Text style={s.controlLabel}>{label}</Text>
        </Pressable>
    );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#0A0A0F" },

    remoteVideo: { ...StyleSheet.absoluteFillObject },
    connectedBg: { flex: 1, backgroundColor: "#0F1A14" },
    videoBg: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10 },
    remoteName: { fontSize: 22, fontWeight: "700", color: "rgba(255,255,255,0.85)" },
    remoteStatus: { flexDirection: "row", alignItems: "center", gap: 7 },
    remoteStatusTxt: { fontSize: 13, color: "rgba(255,255,255,0.55)" },
    greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.semantic.success },

    connectingBg: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
    pulsering: {
        position: "absolute", width: 140, height: 140, borderRadius: 70,
        borderWidth: 2, borderColor: "rgba(148,113,193,0.4)",
    },
    connectingTxt: { color: "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: "500", marginTop: 4 },

    localVideo: {
        position: "absolute", top: 110, right: 16,
        width: 90, height: 130, borderRadius: 12,
        backgroundColor: "#1A2520", borderWidth: 2, borderColor: "rgba(255,255,255,0.15)",
        overflow: "hidden", zIndex: 10,
    },
    localVideoInner: { flex: 1, alignItems: "center", justifyContent: "center", gap: 4 },
    localLabel: { fontSize: 10, color: "rgba(255,255,255,0.55)" },
    camOffBox: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#111" },

    topBar: { position: "absolute", top: 0, left: 0, right: 0, zIndex: 20 },
    topBarInner: {
        flexDirection: "row", justifyContent: "space-between", alignItems: "center",
        paddingHorizontal: spacing.screenPadding, paddingTop: 8,
        backgroundColor: "rgba(0,0,0,0.45)",
    },
    callWith: { fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 0.5 },
    callName: { fontSize: 16, fontWeight: "700", color: "#fff" },
    timerBadge: {
        flexDirection: "row", alignItems: "center", gap: 6,
        backgroundColor: "rgba(63,185,80,0.2)", paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20,
    },
    timerTxt: { fontSize: 13, color: colors.semantic.success, fontWeight: "700" },

    chatPanel: {
        position: "absolute", bottom: 110, left: 0, right: 0, height: 340,
        backgroundColor: "rgba(13,17,23,0.95)",
        borderTopLeftRadius: radii.xl, borderTopRightRadius: radii.xl,
        zIndex: 30,
    },
    chatHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: spacing.md, borderBottomWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
    chatHeaderTxt: { fontWeight: "700", color: "#fff", fontSize: 16 },
    chatScroll: { flex: 1 },

    bubble: { maxWidth: "80%", padding: 10, borderRadius: 14 },
    bubbleMe: { alignSelf: "flex-end", backgroundColor: PALETTE.purple },
    bubblePro: { alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.1)" },
    bubbleTxt: { fontSize: 14, lineHeight: 19 },
    bubbleTxtMe: { color: "#fff" },
    bubbleTxtPro: { color: "rgba(255,255,255,0.9)" },
    bubbleTime: { fontSize: 10, color: "rgba(255,255,255,0.45)", marginTop: 4, textAlign: "right" },

    chatInput: {
        flexDirection: "row", alignItems: "center", gap: 8,
        padding: spacing.sm, borderTopWidth: 1, borderColor: "rgba(255,255,255,0.08)",
    },
    chatTextInput: {
        flex: 1, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 20,
        paddingHorizontal: 14, paddingVertical: 10, color: "#fff", fontSize: 14,
    },
    sendBtn: {
        width: 36, height: 36, borderRadius: 18, backgroundColor: PALETTE.purple,
        alignItems: "center", justifyContent: "center",
    },

    controls: { position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 20 },
    controlsRow: {
        flexDirection: "row", justifyContent: "space-evenly", alignItems: "center",
        paddingHorizontal: spacing.sm, paddingVertical: 14,
        backgroundColor: "rgba(0,0,0,0.70)",
    },
    controlBtn: { alignItems: "center", gap: 6, minWidth: 60 },
    controlBtnIcon: {
        width: 52, height: 52, borderRadius: 26,
        alignItems: "center", justifyContent: "center",
        position: "relative",
    },
    controlLabel: { fontSize: 10, color: "rgba(255,255,255,0.6)", fontWeight: "500" },
    badgeDot: {
        position: "absolute", top: -2, right: -2,
        width: 18, height: 18, borderRadius: 9, backgroundColor: colors.semantic.danger,
        alignItems: "center", justifyContent: "center",
    },
    badgeDotTxt: { fontSize: 9, color: "#fff", fontWeight: "800" },
});
