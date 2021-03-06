package party.of.newyearliterature.work;

import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.CreationTimestamp;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import party.of.newyearliterature.user.User;

/**
 * Work
 */
@Setter
@Getter
@Entity
@Table(name = "tbl_work")
@EqualsAndHashCode(of={"id"})
public class Work {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String article;

    private String author;

    @ManyToOne
    @JoinColumn
    private User user;
    
    @Enumerated(EnumType.STRING)
    private Award award;

    enum Award {
        GOLD, SILVER, BRONZE, BASIC
    }
    
    @CreationTimestamp
    private LocalDateTime createdAt;

    public Work(){}
    public Work(String article, String author, User user){
        this.article = article;
        this.author = author;
        this.user = user;
    }

    public Work(Long id, String article, String author, User user){
        this.id = id;
        this.article = article;
        this.author = author;
        this.user = user;
    }
    public Work(Long id, String article, String author, LocalDateTime createdAt, User user){
        this.id = id;
        this.article = article;
        this.author = author;
        this.createdAt = createdAt;
        this.user = user;
    }
}
