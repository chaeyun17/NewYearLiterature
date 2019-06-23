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

import lombok.Data;
import party.of.newyearliterature.user.User;

/**
 * Work
 */
@Data
@Entity
@Table(name="tbl_work")
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
}