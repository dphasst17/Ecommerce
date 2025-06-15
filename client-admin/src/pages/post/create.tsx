import { useState, useEffect, useRef, useMemo, useContext, ChangeEvent } from 'react';
import ReactQuill, { Quill, Range } from 'react-quill';
import 'react-quill/dist/quill.snow.css';// import styles
import { formats, tollBars } from './toolBar';
import ImageUploader from "quill-image-uploader";
import hljs from 'highlight.js'
import "highlight.js/styles/monokai-sublime.min.css";
import { useForm } from 'react-hook-form';
import ImageResize from 'quill-image-resize-module-react';
import { StateContext } from '../../context/state';
import { uploadImagePostToS3 } from '../../api/image';
import { GetToken } from '../../utils/token';
import { postCreate } from '../../api/post';
import { Input, Select, SelectItem } from '@nextui-org/react';
import { CategoryPostType } from '../../types/types';
import { toast } from 'react-toastify';
// import styles
//Config màu cho code block
hljs.configure({
  languages: ['typescript', 'javascript', 'php', 'html', 'css', 'java', 'ruby', 'python', 'rust', 'sql'],
})
const Block = Quill.import("blots/block");
Block.tagName = "DIV";
Quill.register(Block, true);
Quill.register('modules/imageResize', ImageResize);
Quill.register("modules/imageUploader", ImageUploader);

const CreatePosts = () => {
  const { isDark, typePost, setPost, post } = useContext(StateContext)
  const { register, handleSubmit, formState: { errors: err } } = useForm();
  const [value, setValue] = useState('');
  const [resultValue, setResultValue] = useState<string | null>(null);
  const [imgFile, setImgFile] = useState<File[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [title, setTitle] = useState<string | null>(null)
  const [imgUrl, setImgUrl] = useState<string[]>([]);
  const quillRef = useRef<ReactQuill | null>(null);
  useEffect(() => {
    // Highlight code blocks when the component mounts or updates
    if (quillRef.current) {
      const nodes = quillRef?.current?.getEditor().root.querySelectorAll('pre');

      nodes.forEach((node) => {
        hljs.highlightBlock(node);
        console.log(hljs.highlightBlock(node))
      });
    }
  }, []);

  const modules = useMemo(() => ({
    syntax: {
      highlight: (text: string) => hljs.highlightAuto(text).value,
    },
    toolbar: tollBars,
    imageUploader: {
      upload: (file: File) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader(); // Khởi tạo đọc file
          reader.onload = () => {
            const base64ImageSrc = reader.result; // Đọc nội dung file dưới dạng base64
            if (base64ImageSrc !== null) {
              // Đọc nội dung file dưới dạng base64
              const byteString = typeof base64ImageSrc === 'string' ? atob(base64ImageSrc.split(',')[1]) : "";
              // Lấy loại định dạng file từ base64
              const mimeString = base64ImageSrc && typeof base64ImageSrc === 'string' && base64ImageSrc.split(',')[0].split(':')[1].split(';')[0];
              // Tạo một mảng byte từ nội dung file dưới dạng base64
              const arrayBuffer = byteString ? new ArrayBuffer(byteString.length) : null;
              const int8Array = arrayBuffer ? new Uint8Array(arrayBuffer) : new Uint8Array();

              // Chuyển đổi từng ký tự trong byteString thành ký tự Unicode và gán giá trị của chúng vào int8Array
              for (let i = 0; i < byteString.length; i++) {
                int8Array[i] = byteString.charCodeAt(i);
              }

              const imageFile: File | false = int8Array.length !== 0 && new File([int8Array], file.name, { type: mimeString as string });
              imageFile && setImgFile((prevImgFile: File[]) => [...prevImgFile, imageFile]); // Thêm file vào mảng imgFile
              resolve(base64ImageSrc);
            } else {
              reject('Thất bại trong việc đọc file');
            }
          };
          reader.onerror = () => {
            reject('Thất bại trong việc đọc file');
          };
          reader.readAsDataURL(file); // Đọc file theo định dạng base64
        });
      },
    },
    imageResize: {
      parchment: Quill.import('parchment'),
      modules: ['Resize', 'DisplaySize', 'Toolbar']
    }
  }), []);

  // Hàm này được gọi khi người dùng nhấn vào nút chọn ảnh
  // Đầu tiên ta tạo ra một đối tượng input với thuộc tính type là file và accept là ảnh
  // Sau đó ta tạo ra một sự kiện click cho đối tượng input để mở hộp thoại chọn file
  // Khi người dùng chọn một file, ta tạo ra một đối tượng FileReader để đọc nội dung của file
  // Sau đó ta tạo một sự kiện onloadend cho đối tượng FileReader, ở đây ta sẽ thực hiện các thao tác khi nội dung file đã được đọc xong
  // Trong sự kiện onloadend, ta lấy ra trạng thái của chỉnh sửa hiện tại bằng cách sử dụng quillRef.current?.getEditor().getSelection(true)
  // Sau đó ta thêm một ảnh vào trạng thái chỉnh sửa bằng cách sử dụng hàm insertEmbed của quillRef.current?.getEditor()
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files && input.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const range = quillRef.current?.getEditor().getSelection(true);
        range && quillRef.current?.getEditor().insertEmbed(range.index, 'image', reader.result);
      };

      if (file) {
        reader.readAsDataURL(file);
      }
    };
  };
  //Short key 
  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();

      editor.keyboard.addBinding({
        key: 'l', // The key you want to bind
        shortKey: true,
        shiftKey: true,
      } as any, (range: Range, _context: any) => {
        const format = range && editor.getFormat(range); // Get the current format
        if (format && format['code-block']) {
          // If the user is in a code block, remove it
          editor.format('code-block', false);
        } else {
          // If the user is not in a code block, add it
          editor.format('code-block', true);
        }
      });

      const keys = ['2', '3', '4', '5', '6', '7'];

      keys.forEach((key, index) => {
        editor.keyboard.addBinding({
          key: key,
          shortKey: true, // Whether you want to use `CMD`/`CTRL`
        }, function (_range: Range, _context) {
          // What happens when the shortcut is triggered
          editor.format('header', index + 1);
        });
      });

      editor.keyboard.addBinding({
        key: '0', // The key you want to bind
        shortKey: true, // Whether you want to use `CMD`/`CTRL`
      }, (_range, _context) => {
        // What happens when the shortcut is triggered
        editor.format('header', false); // Remove header format
      });

      const keysSize = ['1', '2', '3', '4'];
      const sizes = ['small', false, 'large', 'huge'];
      keysSize.forEach((key, index) => {
        editor.keyboard.addBinding({
          key: key,
          shortKey: true,
          shiftKey: true,
        } as any, (_range, _context) => {

          editor.format('size', sizes[index]);
        });
      });

      const shortcuts: { [x: string]: { format: string, value: string } } = {
        'R': { format: 'align', value: 'right' },
        'E': { format: 'align', value: 'center' },
        'J': { format: 'align', value: 'justify' },
      };

      Object.keys(shortcuts).forEach((key) => {
        editor.keyboard.addBinding({
          key: key,
          shortKey: true,

        }, (_range, _context) => {

          editor.format(shortcuts[key].format, shortcuts[key].value);
        });
      });

      editor.keyboard.addBinding({
        key: 'I', // The key you want to bind
        shortKey: true, // Whether you want to use `CMD`/`CTRL`
        shiftKey: true,
      } as any, (_range: Range, _context: any) => {
        imageHandler();
      });
    }
  }, []);

  // Khi giá trị `value` hoặc `imgUrl` thay đổi, thực hiện các bước sau:
  // - Tạo một đối tượng `DOMParser`
  // - Parser nội dung HTML từ `value`
  // - Lấy tất cả các phần tử `<img>` trong HTML
  // - Duyệt qua từng phần tử `<img>` và thay đổi `src` của từng phần tử thành `imgUrl[i]` (tương ứng vị trí của phần tử trong mảng `imgUrl`)
  // - Lấy nội dung HTML từ phần tử `<body>` của HTML đã parser
  // - Gán giá trị `doc.body.innerHTML` cho `resultValue`
  useEffect(() => {
    if (value !== "" && imgUrl.length !== 0) {
      let parser = new DOMParser();
      let doc: any = parser.parseFromString(value, 'text/html');
      let images = doc.getElementsByTagName('img');
      for (let i = 0; i < images.length; i++) {
        images[i].src = imgUrl[i];
      }
      // Gán giá trị nội dung HTML từ phần tử `<body>` của HTML đã parser thành `resultValue`
      setResultValue(doc.body.innerHTML);
    }
    if (value !== "") {
      let parser = new DOMParser();
      let doc: any = parser.parseFromString(value, 'text/html');
      setResultValue(doc.body.innerHTML);
    }
  }, [value, imgUrl]);
  useEffect(() => {
    imgFile && setImgUrl(imgFile.map(e => `${import.meta.env.VITE_REACT_APP_URL_IMG}/posts/${e.name}`))
  }, [imgFile])
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Lấy tệp tin đầu tiên từ input
    if (file) {
      setThumbnail(file)
    }
  };
  //Hàm tạo bài viết
  const onSubmit = (data: any) => {
    if (!title) {
      alert("Title is Null")
      return
    }
    if (!thumbnail) {
      alert("Thumbnail is Null")
      return
    }
    if (!resultValue) {
      alert("Content is Null")
      return
    }
    if (imgFile.length !== 0) {
      //Upload hình ảnh trong bài viết lên S3 Storage
      const data = new FormData()
      for (let i = 0; i < imgFile.length; i++) {
        data.append(`file${[i]}`, imgFile[i])
      }
      uploadImagePostToS3(data)
        .then(res => console.log(res))
        .catch((err: any) => console.log(err))
    }
    //Upload hình ảnh thumbnail lên S3 Storage
    const dataThumbnail = new FormData()
    thumbnail && dataThumbnail.append('file', thumbnail)
    thumbnail && uploadImagePostToS3(dataThumbnail)
      .then(res => console.log(res))
      .catch((err: any) => console.log(err))

    //Tạo bài viết
    const fetchData = async () => {
      //Lấy token
      const token = await GetToken()
      const dataPost = {
        title: title,
        thumbnails: thumbnail ? `${import.meta.env.VITE_REACT_APP_URL_IMG}/posts/${thumbnail.name}` : "",
        dateAdded: new Date().toISOString().split('T')[0],
        idType: Number(data.type),
        valuesPosts: resultValue && (resultValue as string).replaceAll("'", '"')
      }
      //Gửi dữ liệu tạo bài viết
      token && resultValue && postCreate(dataPost, token)
        .then((res: any) => {
          if (res.status === 201) {
            toast.success(res.message)
            const dataAppend = {
              title: title,
              thumbnails: thumbnail ? `${import.meta.env.VITE_REACT_APP_URL_IMG}/posts/${thumbnail.name}` : "",
              dateAdded: new Date().toISOString().split('T')[0],
              idType: Number(data.type),
              idPost: res.data.id,
              poster: res.data.poster
            }
            setPost([dataAppend, ...post])
          } else {
            toast.error(res.message)
          }
        })
        .catch((err: any) => console.log(err))
    }
    fetchData()
  }
  return (
    <>
      <div className='title-post w-full h-auto flex flex-wrap justify-around mt-10'>
        <Input type='text' placeholder='Title' variant='bordered'
          classNames={{ inputWrapper: `border border-solid ${isDark ? "border-white text-white" : "border-zinc-800 text-black"}` }}
          className='w-2/5'
          onChange={(e) => setTitle(e.target.value)} />
        <input type="file" onChange={handleFileChange}
          className="w-[55%] h-[37px] flex content-center text-gray-500 font-medium text-sm bg-gray-100 file:cursor-pointer cursor-pointer file:border-0 file:py-2 file:px-4 file:mr-4 file:bg-gray-800 file:hover:bg-gray-700 file:text-white rounded" />
      </div>

      <div className="w-full h-[800px] my-4 bg-slate-100">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={setValue}
          formats={formats}
          modules={modules}
          className="h-[95%]"
        />
      </div>
      <form>
        <Select className={`w-[200px] ${err.type ? 'border-red-500' : 'border-transparent'} border-solid border-[3px] rounded-lg`} label="Type Post" placeholder="Select an type post" {...register("type", { required: true })}>
          {typePost && typePost.map((e: CategoryPostType) => <SelectItem className={`${isDark ? 'text-white' : 'text-slate-700'} `} key={e.idType}>
            {e.nameType}
          </SelectItem>)}
        </Select>
      </form>
      <button className={`w-[200px] h-[40px] bg-transparent hover:bg-blue-500 border-solid border-blue-500 border-[2px] rounded-lg 
        ${isDark === true ? 'text-white' : 'text-slate-700'} hover:text-white font-bold my-2 transition-all`}
        onClick={(e) => { e.preventDefault(); handleSubmit(onSubmit)() }}
      >
        Create Post
      </button>
    </>
  );
};

export default CreatePosts;