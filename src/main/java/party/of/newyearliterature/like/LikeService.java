package party.of.newyearliterature.like;

/**
 * LikeService
 */
public interface LikeService {

    LikeDto save(LikeCreateDto like);
    LikeDto delete(long id);
    void deleteByWorkId(long workId, String userEmail);

}