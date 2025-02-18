import { Dialog } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Avatar } from 'src/components/atoms/avatar/avatar';
import { Button } from 'src/components/atoms/button/button';
import { Card } from 'src/components/atoms/card/card';
import { CategoriesClickable } from 'src/components/atoms/categories-clickable/categories-clickable';
import { TextClickableURLs } from 'src/components/atoms/text-clickable-urls';
import { posts, createPost, CurrentIdentity, uploadMedia } from 'src/core/api';
import { DialogCreate } from 'src/pages/feed/dialog-create/dialog-create';
import css from 'src/pages/feed/dialog-review/dialog-review.module.scss';
import { DialogReviewProps } from 'src/pages/feed/dialog-review/dialog-review.types';
import { RootState } from 'src/store';

export const DialogReview = (props: DialogReviewProps) => {
  const [openDialog, setOpenDialog] = useState(false);

  const identity = useSelector<RootState, CurrentIdentity | undefined>((state) => {
    return state.identity.entities.find((identity) => identity.current);
  });

  const avatarImg = useSelector<RootState, string>((state) => {
    return state.identity.avatarImage;
  });

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    props.onClose();
  };

  async function onSubmit() {
    let imageId: string[] = [];
    if (props.imgFile) {
      const id = await uploadMedia(props.imgFile).then((resp) => resp.id);
      imageId = [id];
    }
    const payload = {
      causes_tags: [props.soucialValue],
      content: props.text,
      media: imageId,
    };
    createPost(payload).then(() => {
      posts({ page: 1 }).then((resp) => {
        props.setFeedList(resp.items);
        handleClose();
      });
    });
  }

  const obj = [
    {
      label: props.soucialValue,
      value: props.soucialValue,
    },
  ];

  return (
    <div className={css.container}>
      <div className={css.header}>
        <div onClick={handleClickOpen}>
          <img src="/icons/chevron-left.svg" alt="" />
        </div>
        <span className={css.title}>Review Post</span>
        <div onClick={props.onClose}>
          <img src="/icons/close-black.svg" alt="" />
        </div>
      </div>
      <div className={css.main}>
        <div className={css.social}>
          {identity && <Avatar img={avatarImg} type={identity.type} />}
          <CategoriesClickable list={obj} />
        </div>
        <div className={css.text}>
          <TextClickableURLs text={props.text} />
        </div>
        <div className={css.image}>
          <Card>
            <img src={props.imgUrl} alt="" />
          </Card>
        </div>
      </div>
      <div className={css.footer}>
        <div className={css.button}>
          <Button onClick={onSubmit} color="blue">
            Post
          </Button>
        </div>
      </div>
      <Dialog fullScreen open={openDialog}>
        <DialogCreate onClose={handleClose} setFeedList={props.setFeedList} />
      </Dialog>
    </div>
  );
};
