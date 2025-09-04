// IconComment Widget - Figmaウィジェット

const { widget } = figma;
const { Input, AutoLayout, Text, useSyncedState, Image } = widget;
import { kinnikunBase64 } from './kinnikun-base64';

// 最後に編集したユーザーの情報を格納する型を定義
type EditorInfo = {
  name: string;
  photoUrl: string | null;
} | null;

function formatTimestamp() {
  const now = new Date();
  const formattedTimestamp = now.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
  return formattedTimestamp;
}

function Widget() {
  const [commentText, setCommentText] = useSyncedState('commentText', '');
  // 最後に編集したユーザー情報を保存するstate
  const [lastEditor, setLastEditor] = useSyncedState<EditorInfo>(
    'lastEditor',
    null
  );
  const [timestamp, setTimestamp] = useSyncedState('timestamp', '');
  const imgSrc = lastEditor?.photoUrl ? lastEditor.photoUrl : kinnikunBase64;
  const paddingNum = lastEditor?.name ? 16 : 11.5;

  return (
    <AutoLayout
      name='IconComment'
      verticalAlignItems={'start'}
      horizontalAlignItems={'start'}
      spacing={8}
    >
      {/* UserIcon */}
      <Image
        name='UserIcon'
        width={48}
        height={48}
        cornerRadius={24}
        stroke={'#E5E7EB'}
        strokeWidth={1}
        src={imgSrc}
      />

      {/* Comment */}
      <AutoLayout
        name='Comment'
        cornerRadius={16}
        fill={'#F4F4F5'}
        stroke={'#E5E7EB'}
        strokeWidth={1}
        padding={{ left: 16, right: 16, top: paddingNum, bottom: 11.5 }}
        direction={'vertical'}
        horizontalAlignItems={'start'}
        spacing={4}
      >
        {lastEditor?.name && (
          <AutoLayout
            name='UseInfo'
            verticalAlignItems={'start'}
            horizontalAlignItems={'start'}
            spacing={4}
          >
            <Text
              name='UserName'
              fontSize={10}
              fontWeight={500}
              fill={'#3F3F46'}
              fontFamily={'Noto Sans JP'}
              letterSpacing={0.8}
              lineHeight={'100%'}
            >
              {lastEditor?.name}
            </Text>
            <Text
              name='Timestamp'
              fontSize={10}
              fontWeight={500}
              fill={'#A1A1AA'}
              fontFamily={'Noto Sans JP'}
              letterSpacing={0.8}
              lineHeight={'100%'}
            >
              {timestamp}
            </Text>
          </AutoLayout>
        )}

        <Input
          name='Input'
          fontSize={16}
          fontWeight={700}
          width={240}
          fill={'#3F3F46'}
          fontFamily={'Noto Sans JP'}
          letterSpacing={0.8}
          lineHeight={'155%'}
          value={commentText}
          placeholder='コメントを書いてね'
          onTextEditEnd={(e) => {
            const inputText = e.characters;
            if (inputText.trim().length > 0) {
            if (figma.currentUser) {
              setLastEditor({
                name: figma.currentUser.name,
                photoUrl: figma.currentUser.photoUrl,
              });
              setTimestamp(formatTimestamp());
            }
            setCommentText(inputText);
            }else{
              setLastEditor(null);
              setTimestamp('');
              setCommentText('');
            }
          }}
        />
      </AutoLayout>
    </AutoLayout>
  );
}

widget.register(Widget);
